import LogoWithBlueName from "@/pages/components/utils/LogoWithBlueName";
import ActionButton from "@/pages/components/utils/ActionButton";
import Image from "next/image";
import LoginWithGoogleBtn from "../../../../public/Login With Google.svg";
import SigninInputs from "@/pages/components/Auth/SigninInputs";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/pages/components/SplashScreen";
import { getToken } from "@/components/services/auth";
import { toast } from "react-toastify";
import {useTranslation} from "react-i18next";
import loginFace from "../../../../public/login_face.svg";
import loginApple from "../../../../public/Group 48095648.svg";
import loginBtn from "../../../../public/login_button.svg";

import Link from "next/link";

function RememberMeCheckbox({text}) {
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                id="my-checkbox"
                className="mr-2 border-gray-300 rounded"
            />
            <label
                htmlFor="my-checkbox"
                className="text-xs font-semibold text-gray-900"
            >
                {text}
            </label>
        </div>
    );
}

function SignInPage() {
    const router = useRouter();
    const {t, i18n} = useTranslation("common");
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { login, socialLogin } = useAuth();
    const { token, loading } = useAuth();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await getToken({ email, password });
            login(response.token);
            router.replace("/");
        } catch (error) {
            toast.error("Invalid credentials", error.toString());
            console.error('Error during signup:', error);
        }
    }

    if (loading) {
        return <SplashScreen />
    }
    if (token) {
        router.push('/');
    }
    const handleGoogleSignIn = () => {
        // signIn("google", { callbackUrl: "http://localhost:3000/api/auth/callback/google" });
        socialLogin('google');
    };
    return (
        <div id={`signup-page`} className={`w-full h-full my-10 flex flex-col items-center justify-start bg-white`}>
            <LogoWithBlueName />
            <SigninInputs email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
            <div className={`w-full flex items-center justify-between px-3 mt-2`}>
                <RememberMeCheckbox text={t("IAccept")} />
                {/*<div className={`text-mRed text-xs`}>Forget password?</div>*/}
            </div>
            <div onClick={handleSignIn} className={`w-full px-3 mt-6`}>
                <ActionButton text={`${t("SignIn")}`} />
            </div>
            <div className={`flex items-center justify-center w-full px-12 mt-8 `}>
                <span className="flex-grow h-0.5 bg-lightDark"></span>
                <div className="mx-4 text-gray-600">{t("OrContinue")}</div>
                <span className="flex-grow h-0.5 bg-lightDark"></span>
            </div>
            <div className={`w-full flex flex-col items-center justify-center mt-4 px-10`}>
                <Image onClick={handleGoogleSignIn} style={{cursor: "pointer"}} src={loginBtn} alt={``} width={400} height={40}/>
                {/*<Image style={{cursor: "pointer"}} className={`my-4`}*/}
                {/*       src={loginFace} alt={``} width={400} height={40}/>*/}
                {/*<Image style={{cursor: "pointer"}} className={`my-0 mb-2`} src={loginApple} alt={``} width={400} height={40}/>*/}

            </div>
            <div className={`mt-4`}>
                <Link
                    href="/forget-password"
                    className="text-black hover:underline"
                >
                    {t("Forget Password")}
                </Link>
            </div>
            <div onClick={() => {
                router.push('/signup');
            }} className={`text-center mt-4 text-blue-600 cursor-pointer`}>
                {t("DoNotHaveAccount")} ? <span className={`w-full px-2 max-h-12 underline`}>{t("SignUp")}</span>
            </div>
        </div>
    );
}

export default SignInPage;
