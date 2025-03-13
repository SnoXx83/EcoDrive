import LocationSearch, { Ville } from '@/components/LocationSearch';
import { CREATE_NEW_TRIP } from '@/graphql/mutations/mutations';
import { useMutation } from '@apollo/client';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';


type Inputs = {
    // departure_time: string;
    departure_time: Dayjs | null;
    start_location: string;
    end_location: string;
    available_place: string;
    price: string;
    owner: string;
    description: string;
}

const CreationTrip: React.FC = () => {
    const router = useRouter();
    if (localStorage.getItem("jwt") === null) {
        console.log("redirect to login page");
        router.push("/login");
    }
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
        setValue: setFormValue,
        control,
    } = useForm<Inputs>();

    const [createNewTrip, { loading: createTripLoading, error: createTripError }] = useMutation(CREATE_NEW_TRIP);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    const handleVilleDepartSelect = (ville: Ville) => {
        setValue("start_location", ville.nom); // Mise à jour de la valeur du formulaire
    };

    const handleVilleArriveeSelect = (ville: Ville) => {
        setValue("end_location", ville.nom); // Mise à jour de la valeur du formulaire
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            await createNewTrip({
                variables: {
                    tripData: {
                        // departure_time: data.departure_time,
                        departure_time: data.departure_time?.toISOString(),
                        start_location: data.start_location,
                        end_location: data.end_location,
                        // available_place: data.available_place,
                        available_place: String(data.available_place),
                        price: Number.parseInt(data.price),
                        owner: data.owner,
                        description: data.description,
                    },
                },
            });
            setSuccessMessage("Trajet créé avec succès !");
            reset();
        } catch (error: any) {
            setErrorMessage(error.message || "Une erreur est survenue.");
        }
    };

    return (
        <div className='m-50'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Paper elevation={3} sx={{ padding: 4, maxWidth: 650, margin: '0 auto' }}>
                    <Typography variant="h5" component="h2" gutterBottom>Créer un trajet</Typography>
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
            </LocalizationProvider>
        </div >
    );
};

export default CreationTrip;