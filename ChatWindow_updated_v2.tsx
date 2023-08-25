"use client";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useChat } from "ai/react";
import { useRef, useState, useEffect, ReactElement } from "react";
import type { FormEvent } from "react";
import type { AgentStep } from "langchain/schema";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { IntermediateStep } from "./IntermediateStep";

import { ModelSelectionDropdown } from './ModelSelectionDropdown';
import { FeatureSelectionDropdown } from './FeatureSelectionDropdown';

export function ChatWindow(props: {
  endpoint: string,
  emptyStateComponent: ReactElement,
  placeholder?: string,
  titleText?: string,
  emoji?: string;
  showIngestForm?: boolean,
  showIntermediateStepsToggle?: boolean
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const onFeatureSelect = (feature: string) => { /* Implement feature selection logic here */ };
  const { endpoint, emptyStateComponent, placeholder, titleText = "An LLM", showIngestForm, showIntermediateStepsToggle, emoji } = props;

  const [selectedFeature, setSelectedFeature] = useState('Structured Output');
  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] = useState(false);

  const ingestForm = showIngestForm && <UploadDocumentsForm />;
  const intermediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input type="checkbox" id="show_intermediate_steps" name="show_intermediate_steps" checked={showIntermediateSteps} onChange={(e) => setShowIntermediateSteps(e.target.checked)} />
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } =
    useChat({
      api: endpoint,
      onError: (e) => {
        toast(e.message, {
          theme: "dark"
        });
      }
    });
  // components/ChatWindow.tsx

// Define the onFeatureSelect function
  const onFeatureSelect = (feature) => {
    console.log(`Selected feature: ${feature}`);
  };

// 
  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("sending");
    }
    
    try {
      await handleSubmit(e); // Pass the event to handleSubmit
      if (messageContainerRef.current) {
        messageContainerRef.current.classList.remove("sending");
      }
    } catch (error) {
      if (messageContainerRef.current) {
        messageContainerRef.current.classList.remove("sending");
      }
      toast(error.message, {
        theme: "dark"
      });
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === "agent" && lastMessage.agentStep?.type === "intermediate") {
        setIntermediateStepsLoading(true);
        // Simulate loading intermediate steps
        setTimeout(() => {
          setIntermediateStepsLoading(false);
        }, 2000);
      }
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{titleText}</h2>
        <div className="dropdowns">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ModelSelectionDropdown />
        <FeatureSelectionDropdown onFeatureSelect={onFeatureSelect} />
      </div>
          <FeatureSelectionDropdown selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} />
        </div>
      </div>
      <div className="message-container" ref={messageContainerRef}>
        {messages.length === 0 && emptyStateComponent}
        {messages.map((message, index) => (
          <ChatMessageBubble key={index} message={message} />
        ))}
        {intermediateStepsLoading && <IntermediateStep />}
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={chatEndpointIsLoading}
        />
        <button type="submit" disabled={chatEndpointIsLoading}>
          {emoji ? <span role="img" aria-label="Send">{emoji}</span> : "Send"}
        </button>
      </form>
      {ingestForm}
      {intermediateStepsToggle}
      <ToastContainer />
    </div>
  );
}