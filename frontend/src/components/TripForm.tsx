// components/TripForm.tsx
import LocationSearch, { Ville } from '@/components/LocationSearch';
import { CREATE_NEW_TRIP } from '@/graphql/mutations/mutations';
import { useMutation } from '@apollo/client';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

type Inputs = {
    departure_time: Dayjs | null;
    start_location: string;
    end_location: string;
    available_place: string;
    price: string;
    owner: string;
    description: string;
};

interface TripFormProps {
    onSuccess?: () => void; // Ajout d'une prop pour la gestion du succès
}

const TripForm: React.FC<TripFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
    } = useForm<Inputs>();

    const [createNewTrip] = useMutation(CREATE_NEW_TRIP);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleVilleDepartSelect = (ville: Ville) => {
        setValue("start_location", ville.nom);
    };

    const handleVilleArriveeSelect = (ville: Ville) => {
        setValue("end_location", ville.nom);
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            await createNewTrip({
                variables: {
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
            setSuccessMessage("Trajet créé avec succès !");
            reset();
            if (onSuccess) {
                onSuccess(); // Appel de la fonction de gestion du succès
            }
        } catch (error) {
            // setErrorMessage(error.message || "Une erreur est survenue.");
            if (error instanceof Error) {
                setErrorMessage(error.message || "Une erreur est survenue.");
              } else {
                setErrorMessage("Une erreur inconnue est survenue.");
              }
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 650, margin: '0 auto' }}>
                <Typography variant="h5" component="h2" gutterBottom>Créer un trajet</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}
                    {successMessage && <Typography color="success" gutterBottom>{successMessage}</Typography>}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <DemoContainer components={['DateTimePicker']}>
                            <Controller name="departure_time"
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
                            <LocationSearch name="ville de départ" label="start_location" onSelect={handleVilleDepartSelect} />
                            <LocationSearch name="ville d'arrivée" label="end_location" onSelect={handleVilleArriveeSelect} />
                        </Box>
                        <TextField label="Nombre de places libres" type="number" {...register("available_place")} />
                        <TextField label="Prix" type="text" {...register("price")} />
                        <TextField label="Auteur" type="text" {...register("owner")} />
                        <TextField label="Description" multiline rows={5} {...register("description")} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <Button variant="contained" type="submit">Créer un trajet</Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </LocalizationProvider >

    );
}

export default TripForm;