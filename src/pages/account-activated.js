// pages/account-activated.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from "next/router";

export default function AccountActivated() {
    const [animationComplete, setAnimationComplete] = useState(false);
    const [activationStatus, setActivationStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Get the status and message from URL parameters
        if (router.isReady) {
            const { status, message } = router.query;
            setActivationStatus(status || null);
            setErrorMessage(message || "An error occurred during activation");
        }

        // Trigger the completion animation after the initial animations
        const timer = setTimeout(() => {
            setAnimationComplete(true);
        }, 800);

        return () => clearTimeout(timer);
    }, [router.isReady, router.query]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <Head>
                <title>Account Activation Status</title>
                <meta name="description" content="Your account activation status" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="text-center p-8 rounded-xl bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl transform transition-all duration-500 ease-out hover:scale-105">
                <div className="mb-6">
                    {activationStatus === "success" ? (
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-400 mb-4 transition-all duration-700 ease-out ${animationComplete ? 'scale-100' : 'scale-0'}`}>
                            <svg
                                className="w-8 h-8 text-white transform transition-all duration-700 ease-out animate-bounce"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                ></path>
                            </svg>
                        </div>
                    ) : activationStatus === "error" ? (
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-400 mb-4 transition-all duration-700 ease-out ${animationComplete ? 'scale-100' : 'scale-0'}`}>
                            <svg
                                className="w-8 h-8 text-white transform transition-all duration-700 ease-out"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </div>
                    ) : (
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 mb-4 transition-all duration-700 ease-out ${animationComplete ? 'scale-100' : 'scale-0'}`}>
                            <svg
                                className="w-8 h-8 text-white transform transition-all duration-700 ease-out"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                ></path>
                            </svg>
                        </div>
                    )}

                    <h1 className="text-4xl font-bold text-white mb-2 transform transition-all duration-700 opacity-0 translate-y-4 animate-fadeIn">
                        {activationStatus === "success" ? "Your account activated" :
                            activationStatus === "error" ? "Activation failed" :
                                "Checking activation status..."}
                    </h1>

                    <p className="text-white text-opacity-80 transform transition-all duration-700 delay-300 opacity-0 translate-y-4 animate-fadeIn">
                        {activationStatus === "success" ? "Welcome to our platform! You can now sign in." :
                            activationStatus === "error" ? decodeURIComponent(errorMessage) :
                                "Please wait while we verify your activation link."}
                    </p>
                </div>

                <button
                    onClick={() => {
                        router.replace("/signin");
                    }}
                    className="px-6 py-2 bg-white text-purple-600 rounded-full font-medium transform transition-all duration-500 hover:shadow-lg hover:scale-105 opacity-0 animate-fadeButton"
                >
                    {activationStatus === "success" ? "Continue to Login" :
                        activationStatus === "error" ? "Try Again" :
                            "Go to Login"}
                </button>
            </div>

            {/* Add CSS animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeButton {
                    0% {
                        opacity: 0;
                    }
                    70% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }

                .animate-fadeButton {
                    animation: fadeButton 1.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}