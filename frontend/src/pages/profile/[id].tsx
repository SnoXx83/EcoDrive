import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/components/Layout';
import { GET_USER_BY_ID } from '@/graphql/queries/queries';
import { UPDATE_USER } from '@/graphql/mutations/mutations';
import { useRouter as useNextRouter } from 'next/navigation';
import { Avatar, Grid2, Paper, Typography, TextField, Button } from '@mui/material';

export interface UserInput {
    imageUrl?: string;
    email?: string;
    oldPassword?: string;
    newPassword?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
}

const ProfilePage = () => {
    const router = useRouter();
    const nextRouter = useNextRouter();
    const { id } = router.query;
    const { userId, isLoggedIn } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<UserInput>({});
    useEffect(() => {
        if (!isLoggedIn) {
            nextRouter.push('/login');
        }
    }, [isLoggedIn, nextRouter]);

    const { data, loading, error, refetch } = useQuery(GET_USER_BY_ID, {
        variables: { id: parseInt(id as string, 10) },
        skip: !id,
    });

    const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);


    useEffect(() => {
        if (data?.getUserById) {
            setEditedUser(data.getUserById);
        }
    }, [data]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await updateUser({
                variables: {
                    id: parseInt(id as string, 10),
                    imageUrl: editedUser.imageUrl,
                    email: editedUser.email,
                    oldPassword: editedUser.oldPassword || "",
                    newPassword: editedUser.newPassword || "",
                    first_name: editedUser.first_name,
                    last_name: editedUser.last_name,
                    phone_number: editedUser.phone_number
                },
            });
            setIsEditing(false);
            await refetch();
        } catch (err) {
            console.error('Erreur lors de la sauvegarde :', err);
        }
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error.message}</p>;
    if (!data?.getUserById) return <p>Utilisateur non trouvé.</p>;

    const user = data.getUserById;

    return (
        <div className="main profile-page">
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
                <Grid2 container direction="column" alignItems="center" spacing={2}>
                    <Grid2 container direction="column" spacing={1}>
                        {user.imageUrl ? (
                            <Avatar src={`http://localhost:8000${user.imageUrl}`} sx={{ width: 100, height: 100 }} />
                        ) : (
                            <Avatar sx={{ width: 100, height: 100 }}>{user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}</Avatar>
                        )}
                    </Grid2>
                    <Grid2 container direction="column" spacing={1}>
                        <Typography variant="h5" component="h2">
                            {user.email}
                        </Typography>
                    </Grid2>
                    <Grid2 container direction="column" spacing={1}>
                        {isEditing ? (
                            <>
                                <TextField label="Image URL" name="imageUrl" value={editedUser?.imageUrl || ''} onChange={handleChange} />
                                <TextField label="Email" name="email" value={editedUser?.email || ''} onChange={handleChange} />
                                <TextField label="Ancien Mot de passe" name="oldPassword" value={editedUser?.oldPassword || ''} onChange={handleChange} />
                                <TextField label="Nouveau Mot de passe" name="newPassword" value={editedUser?.newPassword || ''} onChange={handleChange} />
                                <TextField label="Prénom" name="first_name" value={editedUser.first_name || ''} onChange={handleChange} />
                                <TextField label="Nom" name="last_name" value={editedUser.last_name || ''} onChange={handleChange} />
                                <TextField label="Téléphone" name="phone_number" value={editedUser.phone_number || ''} onChange={handleChange} />
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={updateLoading}>
                                    Sauvegarder
                                </Button>
                            </>
                        ) : (
                            <>
                                {user.email && (
                                    <Grid2 container direction="column" spacing={1}>
                                        <Typography variant="body1">
                                            <strong>Email :</strong> {user.email}
                                        </Typography>
                                    </Grid2>
                                )}
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
                                <Button variant="outlined" color="primary" onClick={handleEdit}>
                                    Modifier
                                </Button>
                            </>
                        )}
                    </Grid2>
                </Grid2>
            </Paper>
        </div>
    );
};

export default ProfilePage;