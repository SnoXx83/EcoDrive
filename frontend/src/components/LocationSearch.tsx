import { useState, useEffect, useRef } from 'react';

export interface Ville {
  nom: string;
  code: string;
}

interface VilleProps {
  name: string;
  label: string;
  onSelect: (ville: Ville) => void;
  initialValue?: string;
}

const LocationSearch: React.FC<VilleProps> = ({ name, label, onSelect, initialValue }) => {
  const [inputValue, setInputValue] = useState<string>(initialValue || '');
  const [suggestions, setSuggestions] = useState<Ville[]>([]);
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    if (inputValue && inputValue !== initialValueRef.current && inputValue.length > 2) {
      const fetchVilles = async () => {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${inputValue}&fields=nom,code`
        );
        const data = await response.json();
        setSuggestions(data);
      };

      const debounce = setTimeout(fetchVilles, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
    }
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
      <input type="text" id={label} value={inputValue} onChange={handleInputChange} />
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

export default LocationSearch;



