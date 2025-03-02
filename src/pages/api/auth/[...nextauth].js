import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://krokplus.com";

export default NextAuth({
    useSecureCookies: true,
    secret: "gtb60gSbxPXbqxtr4qRAzqGCwUBb0Y-uRtZvgKXY-Wo",
    trustHost: true,
    debug: true,
    cookies: {
        // Keep the rest of your cookie config but add these options:
        callbackUrl: {
            options: {
                sameSite: "none",
                path: "/",
                secure: true
            }
        },
        csrfToken: {
            options: {
                sameSite: "none",
                path: "/",
                secure: true
            }
        },
        pkceCodeVerifier: {
            options: {
                sameSite: "none",
                path: "/",
                secure: true
            }
        },
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: true,
            },
        },
    },

    providers: [
        GoogleProvider({
            clientId: "794210030409-1jblj5njdfsn27qnjv0nk326fm0o5oi6.apps.googleusercontent.com",
            clientSecret: "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",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {

        async signIn({user, account, profile}) {
            if (account.provider === "google" || account.provider === "facebook" || account.provider === "apple") {
                try {
                    // Make request to Django backend to authenticate with social provider
                    const response = await axios.post(`${API_URL}/api/v1/auth/${account.provider}/`, {
                        access_token: account.access_token,
                        id_token: account.id_token, // For Apple & Google
                    }, {withCredentials: true});

                    // Save the token to the user object to be used in the session
                    user.token = response.data.token;
                    console.log("user", user);
                    return true;
                } catch (error) {
                    console.error("Error details:", error.response?.data || error.message);
                    return "/error?error=social_signin_failed";
                }
            }
            return true;
        },
        async jwt({token, user}) {
            // If user just signed in, add their token to the JWT
            if (user) {
                token.token = user.token;
            }
            console.log("token", token);
            return token;
        },
        async session({session, token}) {
            // Add the token to the session that will be available client-side
            session.token = token.token;
            console.log("session", session);
            return session;
        },

    },

    pages: {
        signIn: '/signin',
        error: '/error',
    },
});