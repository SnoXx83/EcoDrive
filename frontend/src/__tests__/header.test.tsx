import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/Header';
import { UserContext } from '../components/Layout';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation');

describe('Header Component', () => {
    let removeItemMock: jest.SpyInstance;

    beforeEach(() => {
        const mockRouter = {
            push: jest.fn(),
        };
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        removeItemMock = jest.spyOn(Storage.prototype, 'removeItem');
    });

    afterEach(() => {
        removeItemMock.mockRestore();
    });

    it('affiche les boutons de connexion et d\'inscription si l\'utilisateur n\'est pas connecté', () => {
        render(
            <UserContext.Provider value={{ isLoggedIn: false, refetchLogin: jest.fn(), userId: null, role: null }}>
                <Header />
            </UserContext.Provider>
        );

        expect(screen.getByText('Se connecter')).toBeInTheDocument();
        expect(screen.getByText('S\'inscrire')).toBeInTheDocument();
    });

    it('affiche le bouton de déconnexion si l\'utilisateur est connecté', () => {
        render(
            <UserContext.Provider value={{ isLoggedIn: true, refetchLogin: jest.fn(), userId: 123, role: "passenger" }}>
                <Header />
            </UserContext.Provider>
        );

        expect(screen.getByText('Déconnexion')).toBeInTheDocument();
    });

    it('affiche les boutons de passager si le role est passager', () => {
        render(
            <UserContext.Provider value={{ isLoggedIn: true, refetchLogin: jest.fn(), userId: 123, role: "passenger" }}>
                <Header />
            </UserContext.Provider>
        );

        expect(screen.getByText('Trouver un trajet')).toBeInTheDocument();
        expect(screen.getByText('Mon profil')).toBeInTheDocument();
    });

    it('affiche les boutons de conducteur si le role est conducteur', () => {
        render(
            <UserContext.Provider value={{ isLoggedIn: true, refetchLogin: jest.fn(), userId: 123, role: "driver" }}>
                <Header />
            </UserContext.Provider>
        );

        expect(screen.getByText('Publier un trajet')).toBeInTheDocument();
        expect(screen.getByText('Mon profil')).toBeInTheDocument();
    });

    it('déconnecte l\'utilisateur', () => {
        const refetchLoginMock = jest.fn();

        render(
            <UserContext.Provider value={{ isLoggedIn: true, refetchLogin: refetchLoginMock, userId: 123, role: "driver" }}>
                <Header />
            </UserContext.Provider>
        );

        fireEvent.click(screen.getByText('Déconnexion'));

        expect(removeItemMock).toHaveBeenCalledWith('jwt');
        expect(refetchLoginMock).toHaveBeenCalled();
        expect((useRouter()).push).toHaveBeenCalledWith('/');
    });
});