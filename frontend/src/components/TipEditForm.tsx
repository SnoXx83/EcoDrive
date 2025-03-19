// components/TripEditForm.tsx
import LocationSearch, { Ville } from '@/components/LocationSearch';
import { UPDATE_TRIP } from '@/graphql/mutations/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { GET_TRIP_BY_ID } from '@/graphql/queries/queries';

type Inputs = {
    departure_time: Dayjs | null;
    start_location: string;
    end_location: string;
    available_place: string;
    price: string;
    owner: string;
    description: string;
};

interface TripEditFormProps {
    tripId: number;
    onSuccess?: () => void;
}

const TripEditForm: React.FC<TripEditFormProps> = ({ tripId, onSuccess }) => {
    const { loading, error, data } = useQuery(GET_TRIP_BY_ID, { variables: { id: tripId } });

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors, isSubmitting },
        setValue,
        reset,
        control,
    } = useForm<Inputs>({
        defaultValues: {
            departure_time: null, 
            start_location: '',
            end_location: '',
            available_place: '',
            price: '',
            owner: '',
            description: '',
        },
    });

    useEffect(() => {
        if (data && data.getTripById) {
            const trip = data.getTripById;
            setValue('departure_time', trip.departure_time ? new AdapterDayjs().date(trip.departure_time) : null);
            setValue('start_location', trip.start_location);
            setValue('end_location', trip.end_location);
            setValue('available_place', String(trip.available_place));
            setValue('price', String(trip.price));
            setValue('owner', trip.owner);
            setValue('description', trip.description);
        }
    }, [data, setValue]);

    const [updateTrip, { loading: updateTripLoading, error: updateTripError }] = useMutation(UPDATE_TRIP);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleVilleDepartSelect = (ville: Ville) => {
        setValue("start_location", ville.nom);
    };

    const handleVilleArriveeSelect = (ville: Ville) => {
        setValue("end_location", ville.nom);
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            await updateTrip({
                variables: {
                    id: tripId,
                    tripData: {
                        departure_time: data.departure_time?.toISOString(),
                        start_location: data.start_location,
                        end_location: data.end_location,
                        available_place: String(data.available_place),
                        price: Number.parseInt(data.price),
                        owner: data.owner,
                        description: data.description,
                    },
                },
            });
            setSuccessMessage("Trajet mis à jour avec succès !");
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Une erreur est survenue.");
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error.message}</p>;
    if (!data || !data.getTripById) return <p>Trajet introuvable.</p>;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 650, margin: '0 auto' }}>
                <Typography variant="h5" component="h2" gutterBottom>Modifier le trajet</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}
                    {successMessage && <Typography color="success" gutterBottom>{successMessage}</Typography>}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                                        sx={{ width: '100%' }}
                                    />
                                )}
                            />
                        </DemoContainer>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                            <LocationSearch name="ville de départ" label="start_location" onSelect={handleVilleDepartSelect} initialValue={data?.getTripById?.start_location} />
                            <LocationSearch name="ville d'arrivée" label="end_location" onSelect={handleVilleArriveeSelect} initialValue={data?.getTripById?.end_location} />
                        </Box>
                        <TextField label="Nombre de places libres" type="number" {...register("available_place")} />
                        <TextField label="Prix" type="text" {...register("price")} />
                        <TextField label="Auteur" type="text" {...register("owner")} />
                        <TextField label="Description" multiline rows={5} {...register("description")} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <Button variant="contained" type="submit">Mettre à jour le trajet</Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </LocalizationProvider>
    );
};

export default TripEditForm;