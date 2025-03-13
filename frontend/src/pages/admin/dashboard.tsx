import { DELETE_TRIP, DELETE_USER } from "@/graphql/mutations/mutations";
import { GET_ALL_TRIPS, GET_ALL_USERS } from "@/graphql/queries/queries"
import { useMutation, useQuery } from "@apollo/client"
import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import { useState } from "react";

export default function Dashboard() {
    const { loading: usersLoading, error: usersError, data: useresData } = useQuery(GET_ALL_USERS);
    const { loading: tripsLoading, error: tripsError, data: tripsData } = useQuery(GET_ALL_TRIPS);
    const [deleteUser] = useMutation(DELETE_USER);
    const [deleteTrip] = useMutation(DELETE_TRIP);
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    if (usersLoading || tripsLoading) return <p className="main">Chargement...</p>;
    if (usersError || tripsError) return <p className="main">Erreur : {usersError?.message || tripsError?.message}</p>;
    return (
        <div className="main">
            <div>
                <h1>
                    Tableau de bord pour administrateur
                </h1>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Utilisateurs" />
                    <Tab label="Trajets" />
                </Tabs>
            </Box>
            <Box sx={{ padding: 2 }}>
                {value === 0 && (
                    <div>
                        <h2>Utilisateurs :</h2>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell align="left">Email</TableCell>
                                        <TableCell align="left">Nom</TableCell>
                                        <TableCell align="left">Prénom</TableCell>
                                        <TableCell align="left">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {useresData?.getAllUsers?.map((user: any) => (
                                        <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">{user.id}</TableCell>
                                            <TableCell align="left">{user.email}</TableCell>
                                            <TableCell align="left">{user.last_name}</TableCell>
                                            <TableCell align="left">{user.first_name}</TableCell>
                                            <TableCell align="left">
                                                <Button variant="outlined" color="error" onClick={() => {
                                                    deleteUser({
                                                        variables: { id: user.id },
                                                        refetchQueries: [{ query: GET_ALL_USERS }]
                                                    });
                                                }}>Supprimer</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
                {value === 1 && (
                    <div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell align="left">Date & Heure</TableCell>
                                        <TableCell align="left">Ville de départ</TableCell>
                                        <TableCell align="left">Ville d'arrivée</TableCell>
                                        <TableCell align="left">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tripsData?.getAllTrips?.map((trip: any) => (
                                        <TableRow key={trip.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">{trip.id}</TableCell>
                                            <TableCell align="left">{trip.departure_time}</TableCell>
                                            <TableCell align="left">{trip.start_location}</TableCell>
                                            <TableCell align="left">{trip.end_location}</TableCell>
                                            <TableCell align="left">
                                                <Button variant="outlined" color="error" onClick={() => {
                                                    deleteUser({
                                                        variables: { id: trip.id },
                                                        refetchQueries: [{ query: GET_ALL_USERS }]
                                                    });
                                                }}>Supprimer</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
            </Box>
        </div>
    )
}