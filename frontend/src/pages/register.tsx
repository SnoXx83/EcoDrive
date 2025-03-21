import { REGISTER_MUTATION } from "@/graphql/mutations/mutations";
import { Box } from "@mui/material";
import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";

interface RegistrationFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: string;
    imageUrl?: string;
  }


export default function RegistrationPage() {
    const [registerMutation, { loading, error }] = useMutation(REGISTER_MUTATION);
    const [successMessage] = useState<string | null>(null);
    const router= useRouter();
    const onSubmit = (data: RegistrationFormData) => {
        registerMutation({
            variables: {
                newUserData: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    imageUrl: data.imageUrl,
                    email: data.email,
                    password: data.password,
                    phone_number: data.phoneNumber,
                    role: data.role,
                },
            },
        }).then(() => {
            console.log('Mutation succeeded, redirecting to /login');
            router.push('/login');
        }).catch((error) => {
            console.log('Mutation failed:', error);
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (successMessage) return <p>{successMessage}</p>;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f0f0"
        >
            <RegisterForm onSubmit={onSubmit} />
        </Box>
    );
}

