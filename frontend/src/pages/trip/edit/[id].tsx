import TripEditForm from '@/components/TipEditForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const EditTripPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [tripId, setTripId] = useState<number | null>(null);

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

    const handleTripUpdateSuccess = () => {
        router.push('/');

    };

    if (tripId === null) return <p>ID de trajet invalide.</p>;

    return (
        <div className='main'>
            <TripEditForm tripId={tripId} onSuccess={handleTripUpdateSuccess} />
        </div>
    );
};

export default EditTripPage;