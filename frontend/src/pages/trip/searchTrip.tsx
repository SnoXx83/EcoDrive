import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import LocationSearch, { Ville } from '@/components/LocationSearch';
import { GET_TRIPS_BY_CRITERIA } from '@/graphql/queries/queries';

interface Trip {
    id: string;
    departure_time: string;
    start_location: string;
    end_location: string;
    available_place: number;
    price: number;
    owner: string;
    description: string;
}

const SearchTrips: React.FC = () => {
    const [departureTime, setDepartureTime] = useState<string>('');
    const [startLocation, setStartLocation] = useState<string>('');
    const [endLocation, setEndLocation] = useState<string>('');
    const [trips, setTrips] = useState<Trip[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [getTrips, { loading, error }] = useLazyQuery(GET_TRIPS_BY_CRITERIA, {
        onCompleted: (data) => {
            setTrips(data.getTripsByCriteria);
            setErrorMessage(null);
        },
        onError: (err) => {
            setErrorMessage(err.message || "Une erreur est survenue lors de la recherche.");
            setTrips([]);
        },
    });

    const handleVilleDepartSelect = (ville: Ville) => {
        setStartLocation(ville.nom);
    };

    const handleVilleArriveeSelect = (ville: Ville) => {
        setEndLocation(ville.nom);
    };

    const handleSearch = () => {
        getTrips({
            variables: {
                departureTime,
                startLocation,
                endLocation,
            },
        });
    };

    return (
        <div className='main-search'>
            <h2 className='m-10'>Rechercher des trajets</h2>
            <br />
            <form onSubmit={(e) => {
                e.preventDefault();
            }}>

                <div className='d-flex justify-around item-center'>
                    <div className='flex-column m-10'>
                        <label>
                            Date & heure de départ :
                            <br />
                            <input type="datetime-local" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
                        </label>
                    </div>
                    <LocationSearch name="ville de départ" label="start_location" onSelect={handleVilleDepartSelect} />
                    <LocationSearch name="ville d'arrivée" label="end_location" onSelect={handleVilleArriveeSelect} />
                    <button className="btn" onClick={handleSearch} disabled={loading}>
                        Rechercher
                    </button>
                </div>
            </form>

            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

            {loading && <p>Chargement...</p>}

            {trips.length > 0 && (
                <div className='m-50'>
                    <h3>Résultats de la recherche :</h3>
                    <br />
                    <div>
                        {trips.map((trip) => (
                            <div key={trip.id} className='form'>
                                <div className='d-flex justify-between m-10 p-10'>
                                    <div>
                                        Départ : {trip.start_location}
                                    </div>
                                    <div>
                                        {trip.departure_time}
                                    </div>
                                </div>
                                <div className='d-flex flex-end m-10 p-10'>
                                    Prix : {trip.price}€
                                </div>
                                <div className='d-flex justify-between item-center m-10 p-10'>
                                    <div>
                                        Arrivée : {trip.end_location}
                                    </div>
                                    <div className='image'></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchTrips;