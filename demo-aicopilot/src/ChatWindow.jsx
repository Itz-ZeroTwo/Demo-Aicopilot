import React from "react";

export default function ChatWindow({ conversation }) {
  return (
    <main className="chat-window">
      <div className="chat-header">
        <span>{conversation.name}</span>
        <button className="chat-close-btn">✕ Close</button>
      </div>
      <div className="chat-messages">
        {conversation.messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${
              msg.from === "Agent" ? "agent" : "customer"
            }`}
          >
            <div className="chat-message-text">{msg.text}</div>
          </div>
        ))}
        <div className="chat-cursor-hand" />
      </div>
      <div className="chat-input-bar">
        <span>💬 Chat</span>
        <input
          type="text"
          className="chat-input"
          placeholder="Use ⌘K for shortcuts"
        />
        <button className="chat-send-btn">Send ▾</button>
      </div>
    </main>
  );
}
