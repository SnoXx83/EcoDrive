import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import { UserContext } from '@/components/Layout';
import { GET_USER_BY_ID } from '@/graphql/queries/queries';
import { useEffect } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';

const ProfilePage = () => {
    const router = useRouter();
    const nextRouter = useNextRouter();
    const { id } = router.query;
    const { userId, isLoggedIn } = useContext(UserContext);

    useEffect(() => {
        if (!isLoggedIn) {
            nextRouter.push('/login');
        }
    }, [isLoggedIn, nextRouter]);

    const { data, loading, error } = useQuery(GET_USER_BY_ID, {
        variables: { id: parseInt(id as string, 10) },
        skip: !id,
    });

    if (loading) return <p>Chargement...</p>; 
    if (error) return <p>Erreur : {error.message}</p>;
    if (!data?.getUserById) return <p>Utilisateur non trouvé.</p>;

    const user = data.getUserById;

    return (
        <div className="main profile-page">
            <h2>Profil de {user.email}</h2>
            <p>ID : {user.id}</p>
            <p>Rôle : {user.role}</p>

            {user.imageUrl && <img src={user.imageUrl} alt="Profil" />}
            {user.first_name && <p>Prénom : {user.first_name}</p>}
            {user.last_name && <p>Nom : {user.last_name}</p>}
            {user.phone_number && <p>Téléphone : {user.phone_number}</p>}
        </div>
    );
};

export default ProfilePage;