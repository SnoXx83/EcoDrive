import { useState, useEffect } from 'react';

export interface Ville {
  nom: string;
  code: string; // Ou d'autres propriétés de l'API
}

interface VilleProps {
  name: string;
  label: string;
  onSelect: (ville: Ville) => void;
}

const VilleAutocomplete: React.FC<VilleProps> = ({ name, label, onSelect}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Ville[]>([]);

  useEffect(() => {
    const fetchVilles = async () => {
      if (inputValue.length > 2) { // Déclencher la requête après 2 caractères
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${inputValue}&fields=nom,code`
        );
        const data = await response.json();
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchVilles, 300); // Délai pour éviter les requêtes trop fréquentes
    return () => clearTimeout(debounce); // Annuler le timeout si l'utilisateur tape plus vite
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSuggestionClick = (ville: Ville) => {
    setInputValue(ville.nom);
    setSuggestions([]);
    onSelect(ville);
  };

  return (
    <div className='m-10 section_suggestions'>
      <label htmlFor={label}>{name} :</label>
      <br />
      <input  type="text" id={label} value={inputValue} onChange={handleInputChange} />
      <ul className='suggestions'>
        {suggestions.map((ville) => (
          <li key={ville.code} onClick={() => handleSuggestionClick(ville)}>
            {ville.nom}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VilleAutocomplete;