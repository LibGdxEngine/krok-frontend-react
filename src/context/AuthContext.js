// contexts/AuthContext.js
import {createContext, useState, useContext, useEffect} from 'react';
import {getUser} from "@/components/services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            getUser(storedToken).then((user) => {
                setUser(user.profile);
                setLoading(false);
            }).catch((error) => {
                console.error('Error fetching user:', error);
                setLoading(false);
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);


    const login = (token) => {
        setToken(token);
        getUser(token).then((user) => {
            setUser(user.profile);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching user:', error);
            setLoading(false);
        });
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('state');
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
