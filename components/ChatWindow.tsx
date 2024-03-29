"use client";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useChat } from "ai/react";
import { useRef, useState, useEffect, ReactElement } from "react";
import type { FormEvent } from "react";

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

  const [selectedEndpoint, setSelectedEndpoint] = useState(props.endpoint);

  const featureEndpoints = {
    "retrieval": "/api/chat/retrieval/route",
    "agents": "/api/chat/agents/route",
    "retrieval_agents": "/api/chat/retrieval_agents/route",
    "structured_output": "/api/chat/structured_output/route",
   
  };
  
  const onFeatureSelect = (feature: string) => {
    setSelectedEndpoint(featureEndpoints[feature]);
  };


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
      api: selectedEndpoint,
      onError: (e) => {
        toast(e.message, {
          theme: "dark"
        });
      }
    });

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
        <div className="dropdowns" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0", width: "auto", margin: "0 auto" }}>
          <ModelSelectionDropdown />
          <div style={{ width: "10px" }}></div>
          <FeatureSelectionDropdown selectedFeature={selectedFeature} setSelectedFeature={setSelectedFeature} onFeatureSelect={onFeatureSelect} />
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