"use client";

import { useState, useRef, useEffect } from "react";
import { COLORS } from "@/lib/constants";
import { Header } from "@/components/layout/Header";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Dame un plan de comidas para esta semana",
  "¿Cómo puedo acelerar la pérdida de grasa?",
  "Analiza mi progreso reciente",
  "¿Qué ejercicios me recomiendas?",
  "Consejos para mejorar mi sueño",
  "¿Estoy perdiendo músculo?",
];

export default function AiCoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), conversationId }),
      });

      if (res.status === 403) {
        setError("Esta función es exclusiva para usuarios Premium. Actualiza tu plan para acceder al AI Coach.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Error al contactar con el AI Coach. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setConversationId(data.conversationId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch {
      setError("Error de conexión.");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="max-w-[700px] mx-auto px-6 py-5 flex flex-col" style={{ height: "calc(100vh - 80px)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="text-3xl">🤖</div>
          <div>
            <h2 className="text-xl font-bold m-0" style={{ color: COLORS.text }}>AI Coach</h2>
            <p className="text-xs m-0" style={{ color: COLORS.textMuted }}>
              Tu nutricionista y entrenador personal con IA
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-md ml-auto"
            style={{ background: `${COLORS.warning}22`, color: COLORS.warning }}
          >
            PREMIUM
          </span>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-sm text-center mb-6" style={{ color: COLORS.textMuted }}>
                Pregunta sobre nutrición, entreno, sueño o tu progreso.
                <br />
                El coach conoce todos tus datos.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.textDim,
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm animate-fade-in ${
                msg.role === "user" ? "self-end" : "self-start"
              }`}
              style={{
                background: msg.role === "user"
                  ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`
                  : COLORS.card,
                border: msg.role === "assistant" ? `1px solid ${COLORS.border}` : "none",
                color: COLORS.text,
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
              }}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div
              className="self-start rounded-2xl px-4 py-3 text-sm animate-fade-in"
              style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}
            >
              Pensando...
            </div>
          )}

          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{ background: `${COLORS.danger}15`, border: `1px solid ${COLORS.danger}33`, color: COLORS.danger }}
            >
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 py-3 px-4 rounded-xl text-sm outline-none"
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl text-sm font-bold border-none cursor-pointer text-white"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
              opacity: loading || !input.trim() ? 0.5 : 1,
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}
