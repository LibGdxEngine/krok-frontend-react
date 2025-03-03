import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://krokplus.com";

export default NextAuth({
    // useSecureCookies: true,
    secret: "gtb60gSbxPXbqxtr4qRAzqGCwUBb0Y-uRtZvgKXY-Wo",
    trustHost: true,
    debug: true,
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },

    providers: [
        GoogleProvider({
            clientId: "794210030409-1jblj5njdfsn27qnjv0nk326fm0o5oi6.apps.googleusercontent.com",
            clientSecret: "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",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
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
                    });

                    // Save the token to the user object to be used in the session
                    user.token = response.data.token;
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
            return token;
        },
        async session({session, token}) {
            // Add the token to the session that will be available client-side
            session.token = token.token;
            return session;
        },
        // async redirect({url, baseUrl}) {
        //     console.log("Redirecting to:", url);
        //     console.log("Base URL:", baseUrl);
        //     // console.log("Headers:", JSON.stringify(headers, null, 2));
        //     return "http://localhost:8000/api/auth/callback/google";
        // }
    },

    events: {
        async signIn(params) {
            const { user, account = {} } = params;
            return true;
        },
    },
    pages: {
        signIn: '/signin',
        error: '/error',
    },
});