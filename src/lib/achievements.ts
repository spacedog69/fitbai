import { ACHIEVEMENT_TYPES, type Goals } from "./constants";
import { prisma } from "./prisma";

type AchievementKey = keyof typeof ACHIEVEMENT_TYPES;

interface EntryData {
  weight: number;
  waist?: number | null;
  bodyFat?: number | null;
  muscle?: number | null;
}

export async function checkAndGrantAchievements(
  userId: string,
  entries: EntryData[],
  start: { weight: number; waist: number; bodyFat: number; muscle: number },
  goals: Goals,
  docCount: number
) {
  const newAchievements: AchievementKey[] = [];

  const existing = await prisma.achievement.findMany({
    where: { userId },
    select: { type: true },
  });
  const existingTypes = new Set(existing.map((a) => a.type));

  function tryGrant(type: AchievementKey) {
    if (!existingTypes.has(type)) newAchievements.push(type);
  }

  const latest = entries[entries.length - 1];
  const totalLost = latest ? start.weight - latest.weight : 0;

  // Entry count achievements
  if (entries.length >= 1) tryGrant("FIRST_ENTRY");
  if (entries.length >= 10) tryGrant("TEN_ENTRIES");
  if (entries.length >= 50) tryGrant("FIFTY_ENTRIES");

  // Weight loss achievements
  if (totalLost >= 1) tryGrant("LOST_1KG");
  if (totalLost >= 5) tryGrant("LOST_5KG");
  if (totalLost >= 10) tryGrant("LOST_10KG");

  // Goal achievements
  if (latest && latest.weight <= goals.weight) tryGrant("WEIGHT_GOAL");
  if (latest?.waist && latest.waist <= goals.waist) tryGrant("WAIST_GOAL");
  if (latest?.bodyFat && latest.bodyFat <= goals.bodyFat) tryGrant("BODYFAT_GOAL");

  // Document achievement
  if (docCount >= 1) tryGrant("FIRST_DOC");

  // Grant new achievements
  let totalXp = 0;
  for (const type of newAchievements) {
    const def = ACHIEVEMENT_TYPES[type];
    await prisma.achievement.create({
      data: {
        userId,
        type,
        title: def.title,
        description: def.description,
        icon: def.icon,
        xpReward: def.xp,
      },
    });
    totalXp += def.xp;
  }

  // Update XP
  if (totalXp > 0) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: totalXp } },
    });
    // Level up: 200 XP per level
    const newLevel = Math.floor(user.xp / 200) + 1;
    if (newLevel !== user.level) {
      await prisma.user.update({
        where: { id: userId },
        data: { level: newLevel },
      });
    }
  }

  return newAchievements.map((type) => ACHIEVEMENT_TYPES[type]);
}

export async function updateStreak(userId: string, entryDate: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const today = new Date(entryDate);
  const lastEntry = user.lastEntryDate ? new Date(user.lastEntryDate) : null;

  let newStreak = user.streak;
  if (!lastEntry) {
    newStreak = 1;
  } else {
    const diffDays = Math.floor(
      (today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 7) {
      // Weekly entries count as maintaining streak
      newStreak = user.streak + 1;
    } else {
      newStreak = 1;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      streak: newStreak,
      lastEntryDate: entryDate,
    },
  });

  // Check streak achievements
  const existingTypes = new Set(
    (await prisma.achievement.findMany({
      where: { userId },
      select: { type: true },
    })).map((a) => a.type)
  );

  if (newStreak >= 7 && !existingTypes.has("STREAK_7")) {
    const def = ACHIEVEMENT_TYPES.STREAK_7;
    await prisma.achievement.create({
      data: { userId, type: "STREAK_7", title: def.title, description: def.description, icon: def.icon, xpReward: def.xp },
    });
    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: def.xp } } });
  }
  if (newStreak >= 30 && !existingTypes.has("STREAK_30")) {
    const def = ACHIEVEMENT_TYPES.STREAK_30;
    await prisma.achievement.create({
      data: { userId, type: "STREAK_30", title: def.title, description: def.description, icon: def.icon, xpReward: def.xp },
    });
    await prisma.user.update({ where: { id: userId }, data: { xp: { increment: def.xp } } });
  }

  return newStreak;
}
