import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const API_BASE_URL = 'https://site.chimpvine.com';
    const [user, setUser] = useState(null);

    const login = useCallback((token) => {
        try {
            const decodedToken = jwtDecode(token);
            const { user_email, url, display_name } = decodedToken;

            // Set user and store token details
            setUser(decodedToken);
            Cookies.set('authToken', token, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('site_url', url, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('user_email', user_email, { path: '/', secure: true, sameSite: 'Strict' });
            Cookies.set('Display_name', display_name, { path: '/', secure: true, sameSite: 'Strict' });

            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(decodedToken));
        } catch (error) {
            console.error('Invalid token during login:', error);
        }
    }, []);

    const logout = useCallback(async () => {
        const token = Cookies.get('authToken');
        try {
            await axios.post(`${API_BASE_URL}/wp-json/custom/v1/logout`, { token });
        } catch (error) {
            console.error('Error logging out:', error);
        }

        // Clear all user data
        Cookies.remove('authToken', { path: '/' });
        Cookies.remove('site_url', { path: '/' });
        Cookies.remove('user_email', { path: '/' });
        Cookies.remove('Display_name', { path: '/' });
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setUser(null);

        // Navigate to login or home page
        window.location.href = '/login'; // Ensure the user is redirected to login
    }, []);

    const verifyToken = useCallback(async () => {
        const token = Cookies.get('authToken') || localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    setUser((prevUser) => prevUser || decodedToken); // Avoid redundant updates
                    return true;
                }
            } catch (error) {
                console.error('Token verification failed:', error);
            }
        }

        // Handle cleanup for invalid tokens
        Cookies.remove('authToken', { path: '/' });
        localStorage.removeItem('authToken');
        setUser(null);
        return false;
    }, []);

    useEffect(() => {
        // Rehydrate user on mount
        verifyToken();
    }, [verifyToken]);

    return (
        <UserContext.Provider value={{ user, login, logout, verifyToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;

