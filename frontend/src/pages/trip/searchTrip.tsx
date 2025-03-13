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
import { Box, Button, Divider, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

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

    const handleSearch = (data: { departure_time: Dayjs | null }) => {
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
        <Box sx={{ padding: 4, maxWidth: 1100, margin: '0 auto' }}>
            <Typography variant="h5" component="h2" gutterBottom>Rechercher des trajets</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                    <form onSubmit={handleSubmit(handleSearch)}>
                        <Box display="flex" justifyContent="space-around" alignItems="center" padding={2}>
                            <DemoContainer components={['DateTimePicker']} sx={{ paddingTop: 0 }}>
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
                            <Button variant="contained" type="submit" disabled={loading}>Rechercher</Button>
                        </Box>
                    </form>
                </Paper>
            </LocalizationProvider>

            {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}
            {loading && <Typography>Chargement...</Typography>}

            {trips.length > 0 && (
                <Paper elevation={2} sx={{ padding: 2, marginTop: 2 }}>
                    <Typography variant="h6" component="h3" gutterBottom>Résultats de la recherche :</Typography>
                    <List>
                        {trips.map((trip) => (
                            <React.Fragment key={trip.id}>
                                <ListItem component={Link} href={`/booking/${trip.id}`} button>
                                    <ListItemText
                                        primary={`Départ : ${trip.start_location} - Arrivée : ${trip.end_location}`}
                                        secondary={`Date : ${trip.departure_time} - Prix : ${trip.price}€`}
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default SearchTrips;