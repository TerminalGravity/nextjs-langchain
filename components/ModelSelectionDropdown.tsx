import { useState } from 'react';

export function ModelSelectionDropdown() {
  const [selectedModel, setSelectedModel] = useState('GPT-3.5');

  return (
    <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
      {/* Populate with available OpenAI model options */}
      <option value="GPT-3.5">GPT-3.5</option>
      <option value="GPT-4">GPT-4</option>
      <option value="DALL-E">DALL-E</option>
      {/* Add more options as needed */}
    </select>
  );
}