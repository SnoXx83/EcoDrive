import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import { UserContext } from '@/components/Layout';
import { GET_USER_BY_ID } from '@/graphql/queries/queries';
import { useEffect } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';
import { Avatar, Grid, Grid2, Paper, Typography } from '@mui/material';

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
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
                <Grid2 container direction="column" alignItems="center" spacing={2}>
                    <Grid2 container direction="column" spacing={1}  >
                        {user.imageUrl ? (
                            <Avatar src={user.imageUrl} alt="Profil" sx={{ width: 100, height: 100 }} />
                        ) : (
                            <Avatar sx={{ width: 100, height: 100 }}>{user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}</Avatar>
                        )}
                    </Grid2>
                    <Grid2 container direction="column" spacing={1}>
                        <Typography variant="h5" component="h2">
                            Profil de {user.email}
                        </Typography>
                    </Grid2>
                    <Grid2 container direction="column" spacing={1}>
                        <Grid2 container direction="column" spacing={1}>
                            <Typography variant="body1">
                                <strong>ID :</strong> {user.id}
                            </Typography>
                        </Grid2>
                        <Grid2 container direction="column" spacing={1}>
                            <Typography variant="body1">
                                <strong>Rôle :</strong> {user.role}
                            </Typography>
                        </Grid2>
                        {user.first_name && (
                            <Grid2 container direction="column" spacing={1}>
                                <Typography variant="body1">
                                    <strong>Prénom :</strong> {user.first_name}
                                </Typography>
                            </Grid2>
                        )}
                        {user.last_name && (
                            <Grid2 container direction="column" spacing={1}>
                                <Typography variant="body1">
                                    <strong>Nom :</strong> {user.last_name}
                                </Typography>
                            </Grid2>
                        )}
                        {user.phone_number && (
                            <Grid2 container direction="column" spacing={1}>
                                <Typography variant="body1">
                                    <strong>Téléphone :</strong> {user.phone_number}
                                </Typography>
                            </Grid2>
                        )}
                    </Grid2>
                </Grid2>
            </Paper>
        </div>
    );
};

export default ProfilePage;