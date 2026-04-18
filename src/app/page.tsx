"use client";

import { useState } from "react";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    setError(null);
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setAnswer(data.answer);
      setCached(data.cached);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 4 }}>NovaTech FAQ Bot</h1>
      <p style={{ color: "#666", marginBottom: "2rem", fontSize: "0.9rem" }}>
        Ask anything about NovaTech policies, benefits, or processes.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="e.g. What is the vacation policy?"
          style={{
            flex: 1,
            padding: "0.6rem 0.8rem",
            border: "1px solid #ccc",
            borderRadius: 6,
            fontSize: "0.95rem",
          }}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.95rem",
          }}
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {error && <p style={{ color: "#c00", fontSize: "0.9rem" }}>{error}</p>}

      {answer && (
        <div
          style={{
            background: "#f9f9f9",
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: "1rem 1.2rem",
          }}
        >
          <p style={{ margin: 0, lineHeight: 1.6 }}>{answer}</p>
          {cached && (
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: "#999" }}>
              ⚡ Served from prompt cache
            </p>
          )}
        </div>
      )}
    </main>
  );
}
