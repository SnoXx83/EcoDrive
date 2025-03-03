import LocationSearch, { Ville } from '@/components/LocationSearch';
import { CREATE_NEW_TRIP } from '@/graphql/mutations/mutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
    departure_time: string;
    start_location: string;
    end_location: string;
    available_place: string;
    price: string;
    owner: string;
    description: string;
}

const CreationTrip: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
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
                        departure_time: data.departure_time,
                        start_location: data.start_location,
                        end_location: data.end_location,
                        available_place: data.available_place,
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
            <form className='main' onSubmit={handleSubmit(onSubmit)}>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                <div className='d-flex'>
                    <label className='m-10'>
                        Date & heure de départ : <br />
                        <input className="text-field" type='datetime-local' {...register("departure_time")} />
                    </label>
                    <LocationSearch name="ville de départ" label="start_location" onSelect={handleVilleDepartSelect} />
                    <LocationSearch name="ville d'arrivée" label="end_location" onSelect={handleVilleArriveeSelect} />
                </div>
                <br />
                <label className='m-10'>
                    Nombre de place libre : <br />
                    <input className="text-field" type='number' {...register("available_place")} />
                </label>
                <br />
                <label className='m-10'>
                    Prix : <br />
                    <input className="text-field" type="text" {...register("price")} />
                </label>
                <br />
                <label className='m-10'>
                    Auteur : <br />
                    <input className="text-field" type="text" {...register("owner")} />
                </label>
                <label className='m-10'>
                    Description : <br />
                    <textarea id="description" {...register("description")} rows={5} cols={95}></textarea>
                </label>
                <br />
                <button className='btn' onSubmit={(e) => { e.preventDefault(); }}>Créer un trajet</button>
            </form>
        </>
    );
};

export default CreationTrip;