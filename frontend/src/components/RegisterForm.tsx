import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Avatar, Box, Button, FormControlLabel, IconButton, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState, FormEvent, act, useEffect } from "react";

interface RegistrationFormProps {
    onSubmit: (data: any) => void;
}

const RegistrationForm = ({ onSubmit }: RegistrationFormProps) => {
    const [file, setFile] = useState<File>();
    const [imageURL, setImageURL] = useState<String>('');
    const [role, setRole] = useState<string>("passenger");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        onSubmit({ ...data, imageUrl: imageURL, role: role });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            try {
            const formData = new FormData();
            formData.append("file", e.target.files[0], e.target.files[0].name);
            const url = "http://localhost:8000/upload";
            const response = await axios.post(url, formData);
            const filename = response.data.filename;
                setImageURL(filename);
                console.log("imageURL updated:", filename);
            } catch (err) {
                console.log("error", err);
            }
        }
    };


    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Inscription
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                    <IconButton color="primary" aria-label="upload picture" component="label" htmlFor="upload-photo">
                        {imageURL ? (
                            <Avatar src={`http://localhost:8000${imageURL}`} data-testid="avatar-image" sx={{ width: 90, height: 90 }} />
                        ) : (
                            <PhotoCameraIcon sx={{ width: 90, height: 90 }} />
                        )}
                    </IconButton>
                    <input
                        hidden
                        accept="image/*"
                        id="upload-photo"
                        type="file"
                        data-testid="upload-photo-input"
                        onChange={handleFileChange}
                    />
                </Box>
                <TextField required label="Nom" name="lastName" fullWidth margin="normal" />
                <TextField required label="Prénom" name="firstName" fullWidth margin="normal" />
                <TextField required label="Numéro de téléphone" name="phoneNumber" fullWidth margin="normal" />
                <TextField required label="Email" name="email" type="email" fullWidth margin="normal" />
                <TextField required label="Mot de passe" name="password" type="password" fullWidth margin="normal"
                    data-testid="password-input"
                />
                <RadioGroup
                    aria-label="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <FormControlLabel value="passenger" control={<Radio />} label="Passager" />
                    <FormControlLabel value="driver" control={<Radio />} label="Conducteur" />
                </RadioGroup>
                <Box mt={2} display="flex" justifyContent="center">
                    <Button variant="contained" type="submit">
                        S'inscrire
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default RegistrationForm;