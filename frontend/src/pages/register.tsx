import { REGISTER_MUTATION } from "@/graphql/mutations/mutations";
import { useMutation } from "@apollo/client";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegistrationPage() {
    const [file, setFile] = useState<File>();
    const [imageURL, setImageURL] = useState<string>();
    const [registerMutation, { data, loading, error }] = useMutation(REGISTER_MUTATION);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    

    const getErrorMessage = (error: any): string | undefined => {
        if (error && error.message && typeof error.message === 'string') {
            return error.message;
        }
        return undefined;
    };

    const onSubmit = (data: any) => {
        registerMutation({
            variables: {
                newUserData: {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    imageUrl: imageURL,
                    email: data.email,
                    password: data.password,
                    phone_number: data.phoneNumber,
                },
            },
        }).then(() => {
            setSuccessMessage("Inscription réussie !");
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (successMessage) return <p>{successMessage}</p>;


    return (
        <div className="main">
            <input
                type="file"
                onChange={async (e) => {
                    if (e.target.files) {
                        setFile(e.target.files[0]);
                        const url = "http://localhost:8000/upload";
                        const formData = new FormData();
                        formData.append(
                            "file",
                            e.target.files[0],
                            e.target.files[0].name
                        );
                        try {
                            const response = await axios.post(url, formData);
                            setImageURL(response.data.filename);
                        } catch (err) {
                            console.log("error", err);
                        }
                    }
                }}
            />
            {imageURL ? (
                <>
                    <br />
                    <img style={{
                        borderRadius: `50%`
                    }} width={"90"} height={"90"} alt="uploadedImg" src={`http://localhost:8000${imageURL}`} />
                    <br />
                </>
            ) : null}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label className='m-10'>
                    Nom : <br />
                    <input className="text-field" type='text' {...register("lastName", { required: "Nom requis" })} />
                    {getErrorMessage(errors.lastName) && <p>{getErrorMessage(errors.lastName)}</p>}
                </label>
                <br />
                <label className='m-10'>
                    Prénom : <br />
                    <input className="text-field" type='text' {...register("firstName", { required: "Prénom requis" })} />
                    {getErrorMessage(errors.firstName) && <p>{getErrorMessage(errors.firstName)}</p>}
                </label>
                <br />
                <label className='m-10'>
                    Numéro de téléphone : <br />
                    <input className="text-field" type='text' {...register("phoneNumber", { required: "téléphone requis" })} />
                    {getErrorMessage(errors.phoneNumber) && <p>{getErrorMessage(errors.phoneNumber)}</p>}
                </label>
                <br />
                <label className='m-10'>
                    Email : <br />
                    <input className="text-field" type='email' {...register("email", { required: "Email requis" })} />
                    {getErrorMessage(errors.email) && <p>{getErrorMessage(errors.email)}</p>}
                </label>
                <br />
                <label className='m-10'>
                    Mot de passe : <br />
                    <input className="text-field" type='password' {...register("password", { required: "Mot de passe requis" })} />
                    {getErrorMessage(errors.password) && <p>{getErrorMessage(errors.password)}</p>}
                </label>
                <br />
                <button type="submit" onSubmit={(e) => { e.preventDefault(); }}>S'inscrire</button>
            </form>
        </div>
    );
}