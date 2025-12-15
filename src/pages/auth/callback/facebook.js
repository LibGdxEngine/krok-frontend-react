// pages/auth/callback/google.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

export default function FacebookCallback() {
    const router = useRouter();
    const [status, setStatus] = useState('Processing...');
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            if (!router.isReady) return;

            try {
                // Get session information from NextAuth
                const session = await getSession();
                console.log("session: ", session);
                if (session && session.token) {
                    // Save the token from the session in localStorage
                    localStorage.setItem('token', session.token);
                    setStatus('Authentication successful');

                    // Redirect to the home page after a short delay
                    setTimeout(() => {
                        router.push('/');
                    }, 1000);
                } else {
                    setStatus('No session data received');
                    setError('Session is missing token');
                }
            } catch (err) {
                console.error('Callback error:', err);
                setStatus('Authentication failed');
                setError(err.message);
            }
        };

        handleCallback();
    }, [router.isReady, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Head>
                <title>Authentication Callback</title>
            </Head>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-2xl font-bold mb-4">{status}</h1>
                {error ? (
                    <div className="text-red-500 mt-4">
                        <p>Error: {error}</p>
                    </div>
                ) : (
                    <div className="mt-4">
                        <div className="animate-pulse flex justify-center">
                            <div className="w-10 h-10 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-600">Completing authentication process...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
