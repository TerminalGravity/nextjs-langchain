import { useState } from 'react';

export function FeatureSelectionDropdown({ onFeatureSelect }) {
  const [selectedFeature, setSelectedFeature] = useState('Structured Output');

  // Function to load the selected feature
  const loadFeature = (feature: string) => {
    // Load the selected feature
    // This will depend on how your features are implemented
    onFeatureSelect(feature);
  };

  return (
    <select value={selectedFeature} onChange={(e) => {setSelectedFeature(e.target.value); loadFeature(e.target.value);}}>
      <option value="Structured Output">Structured Output</option>
      <option value="Retrieval Agents">Retrieval Agents</option>
      <option value="Retrieval">Retrieval</option>
      <option value="Agents">Agents</option>
    </select>
  );
}