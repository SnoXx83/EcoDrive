import LocationSearch, { Ville } from '@/components/LocationSearch';
import { CREATE_NEW_TRIP } from '@/graphql/mutations/mutations';
import { useMutation } from '@apollo/client';
import { Button, TextField } from '@mui/material';
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
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <form className='main' onSubmit={handleSubmit(onSubmit)}>
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                    {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                    <div className='d-flex'>
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
                    </div>
                    <br />
                    <TextField
                        label="Nombre de places libres"
                        type="number"
                        {...register("available_place")}
                        sx={{ m: 1 }}
                    />
                    <TextField
                        label="Prix"
                        type="text"
                        {...register("price")}
                        sx={{ m: 1 }}
                    />
                    <TextField
                        label="Auteur"
                        type="text"
                        {...register("owner")}
                        sx={{ m: 1 }}
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={5}
                        {...register("description")}
                        sx={{ m: 1, width: '95%' }}
                    />
                    <br />
                    <div className='d-flex justify-center'>
                        <Button variant="contained" type="submit" sx={{ m: 1 }}>
                            Créer un trajet
                        </Button>

                    </div>
                </form>
            </LocalizationProvider>
        </>
    );
};

export default CreationTrip;