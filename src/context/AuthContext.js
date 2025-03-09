// contexts/AuthContext.js
import {createContext, useState, useContext, useEffect} from 'react';
import {useSession, signIn, signOut} from 'next-auth/react';
import {getUser} from "@/components/services/auth";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const {data: session} = useSession();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                setToken(storedToken);
                getUser(storedToken).then((user) => {
                    setUser(user.profile);
                    setLoading(false);
                }).catch((error) => {
                    console.error('Error fetching user:', error);
                    setLoading(false);
                });
                setLoading(false);
            } catch (error) {
                // Token is invalid, remove it
                localStorage.removeItem('token');
                // Check if we have a session from NextAuth
                if (session?.accessToken) {
                    localStorage.setItem('token', session.accessToken);
                    setUser(session.user);
                }
            }
        } else if (session?.token) {
            // Use the token from NextAuth session
            localStorage.setItem('token', session.token);
            setUser(session.user);
        }
        setLoading(false);
    }, [session]);


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

    const socialLogin = async (provider) => {
        await signIn(provider);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('state');
        // Clear session storage
        sessionStorage.clear();
        // Remove all cookies (if using js-cookie)
        Object.keys(Cookies.get()).forEach(cookieName => {
            Cookies.remove(cookieName);
        });
    };

    return (
        <AuthContext.Provider value={{user, token, login, socialLogin, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
