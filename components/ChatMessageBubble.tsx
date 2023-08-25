import { useState } from 'react';
import type { Message } from "ai/react";

export function ChatMessageBubble({ message, aiEmoji }: { message: Message, aiEmoji?: string }) {
  const [role, setRole] = useState(message.role);
  const [content, setContent] = useState(message.content);
  
  const colorClassName = role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
  const alignmentClassName = role === "user" ? "mr-auto" : "ml-auto";
  const prefix = role === "user" ? "🧑" : aiEmoji;
  
  return (
    <div
      className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 flex`}
    >
      <div className="mr-2">
        {prefix}
      </div>
      <div className="whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}