import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRIP_BY_ID } from '@/graphql/queries/queries'; // Assurez-vous d'avoir les bonnes requêtes
import { useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import LocationSearch, { Ville } from '@/components/LocationSearch';
import { UPDATE_TRIP } from '@/graphql/mutations/mutations';

interface Trip {
    departure_time: string;
    start_location: string;
    end_location: string;
    available_place: number;
    price: number;
    owner: string;
    description: string;
}

const UpdateTrip: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [tripId, setTripId] = useState<number | null>(null); //Nouvel état pour id

    useEffect(() => {
        if (id && typeof id === 'string') {
            const parsedId = parseInt(id, 10);
            if (!isNaN(parsedId)) {
                setTripId(parsedId);
            } else {
                setTripId(null);
            }
        } else if (id && typeof id === 'number') {
            setTripId(id);
        } else {
            setTripId(null);
        }
    }, [id]);


    const { loading, error, data } = useQuery(GET_TRIP_BY_ID, { variables: { id: tripId } });
    const [updateTrip] = useMutation(UPDATE_TRIP);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Trip>();

    useEffect(() => {
        if (data && data.getTripById) {
            const trip = data.getTripById;
            setValue('departure_time', trip.departure_time);
            setValue('start_location', trip.start_location);
            setValue('end_location', trip.end_location);
            setValue('available_place', trip.available_place);
            setValue('price', trip.price);
            setValue('owner', trip.owner);
            setValue('description', trip.description);
        }
    }, [data, setValue]);

    const handleVilleDepartSelect = (ville: Ville) => {
        setValue("start_location", ville.nom); // Mise à jour de la valeur du formulaire
    };

    const handleVilleArriveeSelect = (ville: Ville) => {
        setValue("end_location", ville.nom); // Mise à jour de la valeur du formulaire
    };

    const onSubmit: SubmitHandler<Trip> = async (formData) => {
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            await updateTrip({
                variables: {
                    id: parseFloat(id as string),
                    tripData: {
                        departure_time: formData.departure_time,
                        start_location: formData.start_location,
                        end_location: formData.end_location,
                        available_place: formData.available_place,
                        price: formData.price,
                        owner: formData.owner,
                        description: formData.description,
                    },
                },
            });
            setSuccessMessage('Trajet mis à jour avec succès !');
        } catch (err: any) {
            setErrorMessage(err.message || 'Une erreur est survenue.');
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error.message}</p>;
    if (!data || !data.getTripById) return <p>Trajet introuvable.</p>;

    return (
        <form className='main' onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <div className='d-flex'>
                <label className='m-10'>
                    Date & heure de départ : <br />
                    <input className='text-field' type='datetime-local' {...register('departure_time')} />
                </label>
                <LocationSearch name="ville de départ" label="start_location" onSelect={handleVilleDepartSelect} initialValue={data?.getTripById?.start_location} />
                <LocationSearch name="ville d'arrivée" label="end_location" onSelect={handleVilleArriveeSelect} initialValue={data?.getTripById?.end_location} />
            </div>
            <br />
            <label className='m-10'>
                Nombre de place libre : <br />
                <input className='text-field' type='number' {...register('available_place')} />
            </label>
            <br />
            <label className='m-10'>
                Prix : <br />
                <input className='text-field' type='text' {...register('price')} />
            </label>
            <br />
            <label className='m-10'>
                Auteur : <br />
                <input className='text-field' type='text' {...register('owner')} />
            </label>
            <br />
            <label className='m-10'>
                Description : <br />
                <textarea id='description' {...register('description')} rows={5} cols={95}></textarea>
            </label>
            <br />
            <button className='btn' type='submit' disabled={isSubmitting}>
                Mettre à jour le trajet
            </button>
        </form>
    );
};

export default UpdateTrip;