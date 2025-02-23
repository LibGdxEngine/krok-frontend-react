import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import axios from "axios";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: "794210030409-1jblj5njdfsn27qnjv0nk326fm0o5oi6.apps.googleusercontent.com",
            clientSecret:  "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",
            checks: ['pkce', 'state'], // Ensure state check is enabled
        }),
        FacebookProvider({
            clientId: "1132517248571875",
            clientSecret: "05223d30ec68c0c5b227669f8459a706",
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
            },
        },
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                try {
                    const response = await axios.post(
                        `http://localhost:8000/auth/${account.provider}/`,
                        { access_token: account.access_token }
                    );
                    console.log(response);
                    token.accessToken = response.data.key; // Save Django token
                } catch (error) {
                    console.error("Django Authentication Error:", error.response?.data || error.message);
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
});
