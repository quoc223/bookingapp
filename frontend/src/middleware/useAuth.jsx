import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                axios.defaults.withCredentials = true;

                const response = await axios.get(`${__DOMAINNAME__}api/verify-token`);

                setUser(response.data.user);
                setIsAuthenticated(true);
            } catch (error) {
                // Clear any stored authentication tokens/data
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');

                setUser(null);
                setIsAuthenticated(false);
                console.error('Authentication error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Optional logout method
    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return { user, isAuthenticated, isLoading, logout };
};

export default useAuth;
