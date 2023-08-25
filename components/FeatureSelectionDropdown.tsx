import styles from './FeatureSelectionDropdown.module.css';

export function FeatureSelectionDropdown({ 
  selectedFeature, 
  setSelectedFeature, 
  onFeatureSelect 
}: { 
  selectedFeature: string, 
  setSelectedFeature: (feature: string) => void, 
  onFeatureSelect: (feature: string) => void 
}) {
  // Function to load the selected feature
  const loadFeature = (feature: string) => {
    setSelectedFeature(feature); // Set the selected feature
    onFeatureSelect(feature); // Call the callback with the selected feature
  };

  return (
    <div className={styles.dropdownContainer}>
  <label className={styles.label}>Select a Feature:</label>
  <select className={styles.dropdown} value={selectedFeature} onChange={(e) => {setSelectedFeature(e.target.value); loadFeature(e.target.value);}}>
    <option value="Structured Output">Structured Output</option>
    <option value="Retrieval Agents">Retrieval Agents</option>
    <option value="Retrieval">Retrieval</option>
    <option value="Agents">Agents</option>
  </select>
</div>
  );
}