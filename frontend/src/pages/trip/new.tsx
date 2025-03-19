import TripForm from '@/components/TripForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CreationTripPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem("jwt") === null) {
            console.log("redirect to login page");
            router.push("/login");
        }
    }, [router]);

    const handleTripCreationSuccess = () => {
        router.push('/');
    };

    return (
        <div className='m-50'>
            <TripForm onSuccess={handleTripCreationSuccess} />
        </div>
    );
};

export default CreationTripPage;