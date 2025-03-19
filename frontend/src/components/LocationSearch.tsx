import { List, ListItem, ListItemButton, TextField } from '@mui/material';
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

const LocationSearch = ({ name, label, onSelect, initialValue }: VilleProps) => {
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
      <TextField
                label={name}
                id={label}
                value={inputValue}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                          borderBottom: suggestions.length > 0 ? 'none' : '', 
                      },
                  },
              }}
            />
             {suggestions.length > 0 && (
            <List
                sx={{
                    position: 'absolute',
                    top: '100%', 
                    backgroundColor: 'white',
                    width: '225px', 
                    zIndex: 1000,
                    border: '1px solid #ccc',
                    maxHeight: '200px',
                    overflowY: 'auto',
                }}
            >
               {suggestions.map((ville) => (
                    <ListItem key={ville.code} disablePadding>
                        <ListItemButton onClick={() => handleSuggestionClick(ville)}>
                            {ville.nom}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
             )}
    </div>
  );
};

export default LocationSearch;



