import React from "react";

export default function InboxSidebar({ conversations, selectedId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Your inbox</span>
        <span className="sidebar-dropdown">5 Opens ▼</span>
      </div>
      <ul className="sidebar-list">
        {conversations.map((c) => (
          <li
            key={c.id}
            className={`sidebar-item${selectedId === c.id ? " selected" : ""}${
              c.unread ? " unread" : ""
            }`}
            onClick={() => onSelect(c.id)}
          >
            <span className="sidebar-avatar">{c.avatar}</span>
            <div className="sidebar-item-content">
              <span className="sidebar-item-title">{c.name}</span>
              <span className="sidebar-item-preview">{c.preview}</span>
            </div>
            <span className="sidebar-item-time">{c.time}</span>
            {c.unread && <span className="sidebar-unread-dot" />}
          </li>
        ))}
      </ul>
    </aside>
  );
}
