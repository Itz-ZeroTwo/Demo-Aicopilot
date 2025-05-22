import React, { useState, useRef } from "react";

const OPENAI_API_KEY =
  "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";

export default function AICopilotPanel({ conversation }) {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const controllerRef = useRef(null);

  // Streaming OpenAI Chat Completion
  const handleAsk = async (q) => {
    setAIResponse("");
    setSummary("");
    setIsLoading(true);

    controllerRef.current = new AbortController();

    const messages = [
      {
        role: "system",
        content: "You are a helpful AI Copilot for customer support.",
      },
      { role: "user", content: q },
    ];

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          stream: true,
        }),
        signal: controllerRef.current.signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        // OpenAI streams as "data: {...}\n\n"
        const lines = chunk
          .split("\n")
          .filter((line) => line.trim().startsWith("data:"));
        for (const line of lines) {
          const data = line.replace(/^data:\s*/, "");
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setAIResponse((prev) => prev + content);
            }
          } catch (e) {}
        }
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setAIResponse("Sorry, something went wrong.");
    }
  };

  // Summarize the last AI response
  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary("");
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You summarize text for customer support agents in 1-2 sentences.",
            },
            {
              role: "user",
              content: `Summarize this answer for me:\n${aiResponse}`,
            },
          ],
        }),
      });
      const data = await res.json();
      setSummary(data.choices?.[0]?.message?.content || "Could not summarize.");
    } catch (err) {
      setSummary("Could not summarize.");
    }
    setIsSummarizing(false);
  };

  return (
    <aside className="copilot-panel">
      <div className="copilot-tabs">
        <button className="copilot-tab active">AI Copilot</button>
        <button className="copilot-tab">Details</button>
      </div>
      <div className="copilot-content">
        {!aiResponse && !isLoading ? (
          <>
            <div className="copilot-greeting">
              <span className="copilot-emoji">🤖</span>
              <div>
                <div className="copilot-title">Hi, I'm Fin AI Copilot</div>
                <div className="copilot-desc">
                  Ask me anything about this conversation.
                </div>
              </div>
            </div>
            <div className="copilot-suggested">
              <button
                className="copilot-suggested-btn"
                onClick={() => {
                  setQuestion("How do I get a refund?");
                  handleAsk("How do I get a refund?");
                }}
              >
                How do I get a refund?
              </button>
            </div>
          </>
        ) : (
          <div className="copilot-answer" style={{ whiteSpace: "pre-wrap" }}>
            {aiResponse}
            {isLoading && <span className="blinking-cursor">|</span>}
            {aiResponse && !isLoading && (
              <div style={{ marginTop: 12 }}>
                <button
                  className="copilot-suggested-btn"
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                >
                  {isSummarizing ? "Summarizing..." : "Summarize"}
                </button>
              </div>
            )}
            {summary && (
              <div
                className="copilot-summary"
                style={{
                  marginTop: 12,
                  background: "#f7f7fc",
                  borderRadius: 8,
                  padding: 10,
                  color: "#7b61ff",
                }}
              >
                <strong>Summary:</strong> {summary}
              </div>
            )}
          </div>
        )}
        <div className="copilot-ask-bar">
          <input
            type="text"
            className="copilot-ask-input"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && question.trim()) {
                handleAsk(question);
              }
            }}
            disabled={isLoading}
          />
          <button
            className="copilot-ask-btn"
            onClick={() => handleAsk(question)}
            disabled={isLoading || !question.trim()}
          >
            →
          </button>
        </div>
      </div>
    </aside>
  );
}
