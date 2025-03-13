import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TRIP_BY_ID } from '@/graphql/queries/queries';
import { CREATE_BOOKING } from '@/graphql/mutations/mutations';
import { UserContext } from '@/components/Layout';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

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

const Reservation: React.FC = () => {
    const router = useRouter();
    const { userId } = useContext(UserContext);
    const [isUserReady, setIsUserReady] = useState(false);

    // if (userId) {
    //     console.log("ID de l'utilisateur dans Layout :", userId);
    //   }

    useEffect(() => {
        if (userId) {
            setIsUserReady(true);
        } else {
            setIsUserReady(false);
        }
    }, [userId]);


    const { id: tripId } = router.query;
    const [trip, setTrip] = useState<Trip | null>(null);
    const [numberOfSeats, setNumberOfSeats] = useState<number>(1);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { loading, error, data } = useQuery(GET_TRIP_BY_ID, {
        variables: { id: tripId as string },
        skip: !tripId,
    });

    const [createBooking, { loading: bookingLoading, error: bookingError }] =
        useMutation(CREATE_BOOKING, {
            onCompleted: (data) => {
                alert('Réservation effectuée avec succès !');
                console.log("booking id : ", data.createBooking.id);
            },
            onError: (err) => {
                setErrorMessage(err.message || 'Une erreur est survenue lors de la réservation.');
            },
        });

    useEffect(() => {
        if (data && data.getTripById) {
            setTrip(data.getTripById);
        }
    }, [data]);

    const handleBooking = () => {
        if (!isUserReady) {
            setErrorMessage("Vous devez être connecté pour réserver.");
            return console.log(userId);
        }

        if (!trip) return;

        if (numberOfSeats > trip.available_place) {
            setErrorMessage("Le nombre de places demandées est supérieur aux places disponibles.");
            return;
        }

        createBooking({
            variables: {
                tripId: parseInt(tripId as string),
                passengerId: userId,
                numberOfSeats: numberOfSeats,
                bookingStatus: 'PENDING',
            },
        });
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error.message}</p>;
    if (!trip) return <p>Trajet non trouvé.</p>;

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f0f0">
            <Paper elevation={3} sx={{ padding: 5, minWidth: 800 }}>
                <Typography variant="h5" component="h2" gutterBottom>Réservation du trajet</Typography>
                <Typography>Départ : {trip.start_location}</Typography>
                <Typography>Arrivée : {trip.end_location}</Typography>
                <Typography>Heure de départ : {trip.departure_time}</Typography>
                <Typography>Prix : {trip.price}</Typography>
                <Typography>Places disponibles : {trip.available_place}</Typography>
                <TextField
                    label="Nombre de places"
                    type="number"
                    value={numberOfSeats}
                    onChange={(e) => setNumberOfSeats(parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                    margin="normal"
                    fullWidth
                />
                <Box mt={2} display="flex" justifyContent="center">
                    <Button variant="contained" onClick={handleBooking} disabled={bookingLoading}>Réserver</Button>
                </Box>
                {errorMessage && <Typography color="error" mt={2}>{errorMessage}</Typography>}
            </Paper>
        </Box>
    );
};

export default Reservation;