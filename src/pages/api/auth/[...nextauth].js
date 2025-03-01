
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://krokplus.com";

export default NextAuth({
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
        async signIn({ user, account, profile }) {
            if (account.provider === "google" || account.provider === "facebook" || account.provider === "apple") {
                try {
                    // Make request to Django backend to authenticate with social provider
                    const response = await axios.post(`${API_URL}/api/auth/${account.provider}/`, {
                        access_token: account.access_token,
                        id_token: account.id_token, // For Apple & Google
                    });

                    // Save the token to the user object to be used in the session
                    user.token = response.data.access_token;
                    user.refreshToken = response.data.refresh_token;
                    return true;
                } catch (error) {
                    console.error("Error during social sign in:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            // If user just signed in, add their token to the JWT
            if (user) {
                token.accessToken = user.token;
                token.refreshToken = user.refreshToken;
            }
            return token;
        },
        async session({ session, token }) {
            // Add the token to the session that will be available client-side
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            return session;
        },
    },
    events: {
        async signIn({ user }) {
            // You can add custom events here if needed
        },
    },
    pages: {
        signIn: '/signin',
        error: '/error',
    },
});