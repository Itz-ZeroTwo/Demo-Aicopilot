import React, { useState } from "react";
import InboxSidebar from "./InboxSidebar";
import ChatWindow from "./ChatWindow";
import AICopilotPanel from "./AICopilotPanel";

const conversations = [
  {
    id: 1,
    name: "Luis - Github",
    preview: "Hey! I have a cust...",
    time: "45m",
    unread: false,
    selected: true,
    avatar: "🟣",
    messages: [
      {
        from: "Luis",
        text: `I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you'd be able to refund me, as it is un-opened.`,
        time: "45m",
      },
      {
        from: "Agent",
        text: "Let me just look into this for you, Luis.",
        time: "45m",
      },
    ],
  },
  {
    id: 2,
    name: "Ivan - Nike",
    preview: "Hi there, I have a que...",
    time: "50m",
    unread: true,
    selected: false,
    avatar: "🔴",
    messages: [],
  },
  {
    id: 3,
    name: "Lead from New York",
    preview: "Good morning, let me...",
    time: "50m",
    unread: false,
    selected: false,
    avatar: "⚫",
    messages: [],
  },
  {
    id: 4,
    name: "Booking API problems",
    preview: "Bug report",
    time: "45m",
    unread: false,
    selected: false,
    avatar: "⚙️",
    messages: [],
  },
  {
    id: 5,
    name: "Miracle - Exemplary Bank",
    preview: "Hey there, I'm here to...",
    time: "45m",
    unread: false,
    selected: false,
    avatar: "🔘",
    messages: [],
  },
];

export default function App() {
  const [selectedId, setSelectedId] = useState(1);
  const [aiEnabled, setAiEnabled] = useState(true); // For toggle

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div className="app-root">
      {/* Topbar with toggle */}
      <div className="app-topbar">
        <span className="app-logo">Intercom AI Copilot</span>
        <div className="toggle-switch">
          <label className="switch">
            <input
              type="checkbox"
              checked={aiEnabled}
              onChange={() => setAiEnabled((v) => !v)}
            />
            <span className="slider"></span>
          </label>
          <span className="toggle-label">
            {aiEnabled ? "AI Copilot On" : "AI Copilot Off"}
          </span>
        </div>
      </div>
      <InboxSidebar
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ChatWindow conversation={selectedConversation} />
      {aiEnabled && <AICopilotPanel conversation={selectedConversation} />}
    </div>
  );
}
