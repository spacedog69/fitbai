export const COLORS = {
  bg: "#0a0f1a",
  card: "#111827",
  border: "#1e293b",
  accent: "#10b981",
  accentDim: "#065f46",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#f1f5f9",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  purple: "#8b5cf6",
  blue: "#3b82f6",
  orange: "#f97316",
  pink: "#ec4899",
} as const;

export const DEFAULT_GOALS = { weight: 93, waist: 91, bodyFat: 18, muscle: 44 };
export const DEFAULT_START = { weight: 105.5, waist: 104, bodyFat: 26.6, muscle: 43.9 };

export const MAX_FILE_KB = 800;

export const DOC_CATEGORIES = [
  { id: "fitdays", label: "Informes Fitdays", icon: "📊", color: COLORS.accent },
  { id: "dieta", label: "Planes de dieta", icon: "🥗", color: COLORS.orange },
  { id: "entreno", label: "Planes de entreno", icon: "🏋️", color: COLORS.purple },
  { id: "analitica", label: "Analíticas de sangre", icon: "🩸", color: COLORS.danger },
  { id: "otro", label: "Otros documentos", icon: "📎", color: COLORS.blue },
] as const;

export const ACHIEVEMENT_TYPES = {
  FIRST_ENTRY: { title: "Primer paso", description: "Registraste tu primera medida", icon: "🎯", xp: 50 },
  STREAK_7: { title: "1 semana constante", description: "7 días seguidos registrando", icon: "🔥", xp: 100 },
  STREAK_30: { title: "1 mes imparable", description: "30 días de constancia", icon: "💪", xp: 500 },
  LOST_1KG: { title: "Primer kilo", description: "Perdiste tu primer kilo", icon: "⚡", xp: 75 },
  LOST_5KG: { title: "5 kilos menos", description: "Has perdido 5 kilos desde el inicio", icon: "🏆", xp: 200 },
  LOST_10KG: { title: "Transformación", description: "10 kilos menos — ¡increíble!", icon: "🌟", xp: 500 },
  WAIST_GOAL: { title: "Cintura objetivo", description: "Alcanzaste tu meta de cintura", icon: "📏", xp: 300 },
  WEIGHT_GOAL: { title: "Peso objetivo", description: "Alcanzaste tu peso meta", icon: "🏅", xp: 1000 },
  BODYFAT_GOAL: { title: "Grasa objetivo", description: "Alcanzaste tu % grasa meta", icon: "🔥", xp: 500 },
  FIRST_DOC: { title: "Documentado", description: "Subiste tu primer documento", icon: "📁", xp: 25 },
  TEN_ENTRIES: { title: "Comprometido", description: "10 registros completados", icon: "📊", xp: 150 },
  FIFTY_ENTRIES: { title: "Veterano", description: "50 registros — eres un máquina", icon: "👑", xp: 750 },
} as const;

export const MOTIVATIONAL_QUOTES = [
  { text: "El cuerpo logra lo que la mente cree.", author: "Anónimo" },
  { text: "No se trata de ser perfecto, se trata de progresar.", author: "Anónimo" },
  { text: "Cada día es una nueva oportunidad para cambiar tu vida.", author: "Anónimo" },
  { text: "La constancia supera al talento.", author: "Anónimo" },
  { text: "Tu único límite eres tú mismo.", author: "Anónimo" },
  { text: "El dolor que sientes hoy es la fuerza que sentirás mañana.", author: "Anónimo" },
  { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
  { text: "Lo que no te mata, te hace más fuerte.", author: "Nietzsche" },
  { text: "La disciplina es el puente entre metas y logros.", author: "Jim Rohn" },
  { text: "Sé más fuerte que tus excusas.", author: "Anónimo" },
  { text: "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje de continuar.", author: "Churchill" },
  { text: "Hoy duele, mañana dolerá menos.", author: "Anónimo" },
];

export const XP_PER_LEVEL = 200;

export type Goals = { weight: number; waist: number; bodyFat: number; muscle: number };
export type Start = Goals;
