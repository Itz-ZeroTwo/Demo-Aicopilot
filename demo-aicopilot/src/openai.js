const handleAsk = async (q) => {
  setAIResponse("Thinking...");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful AI Copilot for customer support." },
        { role: "user", content: q }
      ]
    })
  });
  const data = await res.json();
  setAIResponse(data.choices?.[0]?.message?.content || "Sorry, I couldn't find an answer.");
};
