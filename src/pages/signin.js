import SignInPage from "@/pages/components/Auth/SignInPage";
import Image from "next/image";
import woman from "../../public/woman.svg";
import loginLogo from "../../public/loginLogo.svg";
import Footer from "@/pages/components/Footer";
import loginIcons1 from "../../public/login_icons_1.svg";
import loginIcons2 from "../../public/login_icons_2.svg";
import loginIcons3 from "../../public/login_icons_3.svg";
import React, {useEffect} from "react";
import {useAuth} from "@/context/AuthContext";
import {getToken, socialAuth} from "@/components/services/auth";
import {toast} from "react-toastify";
import SplashScreen from "@/pages/components/SplashScreen";
import {useRouter} from "next/router";
import Link from "next/link";
import NavBar from "@/pages/components/NavBar";
import SocialLoginButton from "@/pages/components/utils/SocialLoginButton";
import {useTranslation} from "react-i18next";

const Signin = () => {
    const {t, i18n} = useTranslation("common");
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false); // State to toggle password visibility

    const {login} = useAuth();
    const {token, loading} = useAuth();
    // const { data: session } = useSession();
    //
    //
    // useEffect(() => {
    //     if(session){
    //         console.log(session);
    //         // router.replace("/");
    //     }
    // }, [session]);

    if (loading) {
        return <SplashScreen/>;
    }
    if (token) {
        router.push("/");
    }
    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "http://localhost:3000/api/auth/callback/google" });
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await getToken({email, password});
            login(response.token);
            router.replace("/start");
            // Handle successful signup (e.g., redirect to login)
        } catch (error) {
            toast.error(error.response?.data.non_field_errors[0]);
        }
    };
    return (
        <div className={`w-full  flex flex-col`}>
            <div className={`hidden lg:block`}>
                <SignInPage/>
                <Footer/>
            </div>
            <div className={`w-full  lg:hidden`}>
                <NavBar/>
                <div
                    className="w-full flex items-center justify-center min-h-screen
             bg-no-repeat bg-cover"
                    style={{backgroundImage: "url(/login_bg.svg)"}}
                >
                    <div
                        className={`w-full
                        flex flex-col items-center justify-between`}
                    >
                        <div className={`w-32 mt-10`}>
                            <Image src={loginLogo} alt={``} width={200} height={200}/>
                        </div>
                        <div className={`w-72 ms-10`}>
                            <Image src={woman} alt={``} width={250} height={250}/>
                        </div>
                        <Image
                            src={loginIcons1}
                            alt={``}
                            width={100}
                            height={100}
                            className={`absolute right-20 bottom-44`}
                        />
                        <Image
                            src={loginIcons2}
                            alt={``}
                            width={100}
                            height={100}
                            className={`absolute left-20 bottom-44`}
                        />

                        <Image
                            src={loginIcons3}
                            alt={``}
                            width={100}
                            height={100}
                            className={`absolute left-40 bottom-10`}
                        />
                    </div>

                    <div className="w-full h-screen flex flex-col justify-center items-center min-h-screen py-12 px-4">
                        <h1 className="text-5xl font-thin mb-8 text-black">
                            {t("SignIn")}
                        </h1>
                        <div className={`w-full flex flex-col items-center justify-center`}>
                            <SocialLoginButton
                                provider="facebook"
                                clientId="337527847157-rf90dg46v3vgf1i8pivqjer9mujl2urk.apps.googleusercontent.com"
                                redirectUri="http://localhost:3000/signin/"
                            />

                            <SocialLoginButton
                                onClick={handleGoogleSignIn}
                                provider="google"
                                clientId="527835727909-ih4vr6ofhac8jvv6k252hq4llk1plv9b.apps.googleusercontent.com"
                                redirectUri="https://krokplus.com"
                            />
                            <SocialLoginButton
                                provider="apple"
                                clientId="337527847157-rf90dg46v3vgf1i8pivqjer9mujl2urk.apps.googleusercontent.com"
                                redirectUri="http://localhost:3000/signin/"
                            />
                        </div>

                        <form
                            onSubmit={handleSignIn}
                            className="w-[60%] mt-16 flex flex-col space-y-6"
                        >
                            <div className="flex flex-col">
                                <label
                                    htmlFor="email"
                                    className="mb-2 text-sm font-medium text-black"
                                >
                                    {t("Email")}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="shadow-sm rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-1 placeholder-black focus:ring-indigo-500 w-full"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="password"
                                    className="mb-2 text-sm font-medium text-black"
                                >
                                    {t("Password")}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="shadow-sm rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-1 placeholder-black focus:ring-indigo-500 w-full"
                                        placeholder="Enter your password"
                                    />
                                    {/* Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3 text-sm font-medium text-indigo-500"
                                    >
                                        {showPassword ? "Hide" : "Show"} {/* Toggle button text */}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Link
                                    href="/forget-password"
                                    className="text-black hover:underline"
                                >
                                    {t("Forget Password")}
                                </Link>
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="terms" className="mr-2"/>
                                <label htmlFor="terms" className="text-sm text-black">
                                    {t("Remember")}
                                </label>
                            </div>
                            <button
                                type={`submit`}
                                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 placeholder-black focus:ring-indigo-500"
                            >
                                {t("SignIn")}
                            </button>
                        </form>
                        <p className="text-sm mt-6 text-center text-black">
                            {t("DoNotHaveAccount")}{" "}
                            <Link href="/signup" className="text-indigo-600 hover:underline">
                                {t("SignUp")}
                            </Link>
                        </p>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
    );
};

export default Signin;
