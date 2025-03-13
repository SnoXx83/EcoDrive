import React, { useContext, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import LocationSearch, { Ville } from '@/components/LocationSearch';
import { GET_TRIPS_BY_CRITERIA } from '@/graphql/queries/queries';
import Link from 'next/link';
import { UserContext } from '@/components/Layout';
import { Dayjs } from 'dayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Controller, useForm } from 'react-hook-form';

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
    const { control, handleSubmit } = useForm({
        defaultValues: {
            departure_time: null,
        },
    });
    // const [departureTime, setDepartureTime] = useState<Dayjs | null>(null);
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

    const handleSearch = (data: {departure_time: Dayjs | null}) => {
        getTrips({
            variables: {
                // departureTime,
                departureTime: data.departure_time?.toISOString(),
                startLocation,
                endLocation,
            },
        });
    };

    return (
        <div className='main-search'>
            <h2 className='m-10'>Rechercher des trajets</h2>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit(handleSearch)}>

                <div className='p-10 d-flex justify-around item-center'>
                <DemoContainer components={['DateTimePicker']}>
                            <Controller
                                name="departure_time"
                                control={control}
                                defaultValue={null}
                                rules={{ required: 'La date et l\'heure de départ sont requises.' }}
                                render={({ field }) => (
                                    <DateTimePicker
                                        label="Date & heure de départ"
                                        value={field.value}
                                        onChange={field.onChange}
                                        sx={{ m: 1 }}
                                    />
                                )}
                            />
                        </DemoContainer>
                    <LocationSearch name="ville de départ" label="start_location" onSelect={handleVilleDepartSelect} />
                    <LocationSearch name="ville d'arrivée" label="end_location" onSelect={handleVilleArriveeSelect} />
                    <button className="btn" type="submit" disabled={loading}>
                        Rechercher
                    </button>
                </div>
            </form>
            </LocalizationProvider>

            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

            {loading && <p>Chargement...</p>}

            {trips.length > 0 && (
                <div className='m-50'>
                    <h3>Résultats de la recherche :</h3>
                    <br />
                    <div>
                        {trips.map((trip) => (
                            <Link href={`/booking/${trip.id}`} key={trip.id} >
                                <div className='form'>
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
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchTrips;