
import VilleAutocomplete, { Ville } from '@/components/SearchBar';
import { useState } from 'react';


const CreationTrip: React.FC = () => {
    const [villeDepart, setVilleDepart] = useState<Ville | null>(null);
    const [villeArrivee, setVilleArrivee] = useState<Ville | null>(null);

    const handleVilleDepartSelect = (ville: Ville) => {
        setVilleDepart(ville);
    };

    const handleVilleArriveeSelect = (ville: Ville) => {
        setVilleArrivee(ville);
    };

    return (
        <>
            <form className='main' onSubmit={(e)=>{
                e.preventDefault();

                const form= e.target;
                const formData= new FormData(form as HTMLFormElement);

                const formJson= Object.fromEntries(formData.entries());
                console.log(formJson);
            }}>
                <div className='d-flex'>
                    <label className='m-10'>
                        Date & heure de départ : <br />
                        <input className="text-field" name='Date & heure de départ' type='datetime-local'  />
                    </label>
                    <VilleAutocomplete label="Ville de départ" onSelect={handleVilleDepartSelect} />
                    <VilleAutocomplete label="Ville d'arrivée" onSelect={handleVilleArriveeSelect} />

                </div>
                <br />
                <label className='m-10'>
                    Nombre de place libre : <br />
                    <input className="text-field" name='free place' type='number' />
                </label>
                <br />
                <label className='m-10'>
                    Prix : <br />
                    <input className="text-field" name='Price' />
                </label>
                <br />
                <label className='m-10'>
                    Description : <br />
                    <textarea name="description" id="description" rows="5" cols="95"></textarea>
                </label>
                <br />
            <button className='btn' onSubmit={(e) => { e.preventDefault(); }}>Créer un trajet</button>
            </form>
        </>
    );
};

export default CreationTrip;