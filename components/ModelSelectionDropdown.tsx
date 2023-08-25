import { useState } from 'react';
import styles from './ModelSelectionDropdown.module.css';

export function ModelSelectionDropdown() {
  const [selectedModel, setSelectedModel] = useState('GPT-3.5');

  return (
    <div className={styles.dropdownContainer}>
      <label className={styles.label}>Select a Model:</label>
      <select className={styles.dropdown} value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
        {/* Populate with available OpenAI model options */}
        <option value="GPT-3.5">GPT-3.5</option>
        <option value="GPT-4">GPT-4</option>
        <option value="DALL-E">DALL-E</option>
        {/* Add more options as needed */}
      </select>
    </div>
  );
}