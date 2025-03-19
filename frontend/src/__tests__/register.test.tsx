import React from 'react';
// import { act, waitFor, fireEvent, render } from '@testing-library/react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import RegistrationPage from '../pages/register';
import { MockedProvider } from '@apollo/client/testing';
import { REGISTER_MUTATION } from '@/graphql/mutations/mutations';
import { useRouter } from 'next/router';
import axios from 'axios';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('axios');

describe('RegistrationPage', () => {
    it('should submit form and redirect on success', async () => {
        const mockMutation = {
            request: {
                query: REGISTER_MUTATION,
                variables: {
                    newUserData: {
                        first_name: 'John',
                        last_name: 'Doe',
                        imageUrl: '/uploads/1741302372024-82.jpg',
                        email: 'john.doe@example.com',
                        password: 'password123',
                        phone_number: '1234567890',
                        role: 'driver',
                    },
                },
            },
            result: {
                data: {
                    register: {
                        id: 1,
                        email: 'john.doe@example.com',
                        first_name: 'John',
                        last_name: 'Doe',
                        role: 'driver',
                    },
                },
            },
        };

        const mockAxiosPost = jest.mocked(axios.post);
        mockAxiosPost.mockResolvedValue({ data: { filename: '/uploads/1741302372024-82.jpg' } });

        const routerMock = { push: jest.fn() };
        (useRouter as jest.Mock).mockReturnValue(routerMock);

        const { getByRole, getByTestId, findByText } = render(
            <MockedProvider mocks={[mockMutation]} addTypename={false}>
                <RegistrationPage />
            </MockedProvider>
        );

        await act(async () => {

            fireEvent.change(getByRole('textbox', { name: 'Nom' }), { target: { value: 'Doe' } });
            fireEvent.change(getByRole('textbox', { name: 'Prénom' }), { target: { value: 'John' } });
            fireEvent.change(getByRole('textbox', { name: 'Numéro de téléphone' }), { target: { value: '1234567890' } });
            fireEvent.change(getByRole('textbox', { name: 'Email' }), { target: { value: 'john.doe@example.com' } });

            const passwordInput = getByTestId('password-input').querySelector('input');
            if (passwordInput) {
                fireEvent.change(passwordInput, { target: { value: 'password123' } });
            }

            fireEvent.click(getByRole('radio', { name: 'Conducteur' }));
        });

        const file = new File(['(⌐□_□)'], '1741302372024-82.jpg', { type: 'image/jpg' });
        const input = getByTestId('upload-photo-input');

        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
            await waitFor(() => {
                expect(mockAxiosPost).toHaveBeenCalled();
            });
            
        });

        await act(async () => {
            fireEvent.click(await findByText("S'inscrire"));
            waitFor(() => expect(routerMock.push).toHaveBeenCalledWith('/login'));
            expect(mockAxiosPost).toHaveBeenCalled();
            const formData = mockAxiosPost.mock.calls[0][1];
            if (formData instanceof FormData) {
                const fileEntry = formData.get('file');
                if (fileEntry instanceof File) { // Vérification ici
                    expect(fileEntry).toEqual(file);
                    expect(fileEntry.name).toEqual('1741302372024-82.jpg');
                } else {
                    fail('fileEntry is not an instance of File');
                }
            } else {
                fail('formData is not an instance of FormData');
            }
        });
    });
});

