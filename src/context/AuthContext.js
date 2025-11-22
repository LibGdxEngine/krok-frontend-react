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

    const logout = async () => {
        try {
            setLoading(true);
            
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const currentToken = localStorage.getItem('token');
            
            // Step 1: Call Django logout endpoint to clear sessionid and csrftoken cookies
            // HttpOnly cookies can only be cleared by the server via Set-Cookie headers
            if (currentToken) {
                try {
                    // Get CSRF token from cookies if available (for Django)
                    const csrfToken = Cookies.get('csrftoken') || '';
                    
                    // Call Django logout endpoint with credentials to allow cookie exchange
                    const logoutResponse = await fetch(`${API_URL}/api/v1/user/logout/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Token ${currentToken}`,
                            'Content-Type': 'application/json',
                            ...(csrfToken && { 'X-CSRFToken': csrfToken }),
                        },
                        credentials: 'include', // Critical: allows sending/receiving cookies
                    });
                    
                    // Wait for response to ensure Django sets expired cookie headers
                    // Even if the response fails, the server may have cleared cookies
                    if (!logoutResponse.ok) {
                        console.log('Django logout endpoint returned non-OK status, but cookies may still be cleared');
                    }
                } catch (error) {
                    // Continue with logout even if Django endpoint fails
                    // The endpoint might not exist or be unreachable
                    console.log('Django logout endpoint call failed (continuing with logout):', error);
                }
            }
            
            // Step 2: Sign out from NextAuth to clear NextAuth cookies
            // NextAuth will handle clearing its HttpOnly cookies via server-side Set-Cookie headers
            try {
                await signOut({ 
                    redirect: false,
                    callbackUrl: '/signin'
                });
            } catch (error) {
                console.log('NextAuth signOut error (continuing with logout):', error);
            }
            
            // Step 3: Clear local state and storage
            // Note: HttpOnly cookies (sessionid, csrftoken, NextAuth cookies) cannot be deleted
            // by JavaScript - they are cleared by the server in steps 1 and 2 above
            setUser(null);
            setToken(null);
            sessionStorage.clear();
            localStorage.removeItem('token');
            localStorage.removeItem('state');
            
            // Step 4: Clear any non-HttpOnly cookies that might exist
            // This only works for cookies that are NOT HttpOnly
            try {
                const allCookies = Cookies.get();
                Object.keys(allCookies).forEach(cookieName => {
                    // Skip HttpOnly cookies - they can't be deleted by JavaScript
                    // These are handled by server responses above
                    if (!cookieName.includes('sessionid') && 
                        !cookieName.includes('csrftoken') && 
                        !cookieName.includes('next-auth')) {
                        // Try to remove with different path/domain combinations
                        Cookies.remove(cookieName);
                        Cookies.remove(cookieName, { path: '/' });
                        Cookies.remove(cookieName, { path: '/api' });
                        const domain = window.location.hostname;
                        Cookies.remove(cookieName, { domain: domain });
                        Cookies.remove(cookieName, { domain: `.${domain}` });
                    }
                });
            } catch (error) {
                // Ignore cookie removal errors
                console.log('Error removing non-HttpOnly cookies:', error);
            }
            
            setLoading(false);
            
            // Step 5: Force a hard redirect to signin page
            // This ensures a clean state and allows browser to process expired cookie headers
            window.location.href = '/signin';
        } catch (error) {
            console.error('Error during logout:', error);
            setLoading(false);
            
            // Even if there's an error, clear local state and redirect
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            localStorage.removeItem('state');
            sessionStorage.clear();
            
            // Force redirect to ensure clean state
            window.location.href = '/signin';
        }
    };

    return (
        <AuthContext.Provider value={{user, token, login, socialLogin, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
