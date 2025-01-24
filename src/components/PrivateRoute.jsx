import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const PrivateRoute = () => {
    const { verifyToken } = useContext(UserContext); // Only use stable verifyToken
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            const isValid = await verifyToken(); // Await the token verification
            setIsAuthenticated(isValid); // Set authentication status
        };

        checkAuthentication();
    }, [verifyToken]); // Stable dependency

    if (isAuthenticated === null) {
        // Display a loading indicator while verifying authentication
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;