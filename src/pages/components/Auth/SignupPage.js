import LogoWithBlueName from "@/pages/components/utils/LogoWithBlueName";
import SignupInputs from "@/pages/components/Auth/SignupInputs";
import ActionButton from "@/pages/components/utils/ActionButton";
import Image from "next/image";
import LoginWithGoogleBtn from "../../../../public/Login With Google.svg";
import {useRouter} from "next/router";
import React, {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import SplashScreen from "@/pages/components/SplashScreen";
import {toast} from "react-toastify";
import {createUser} from "@/components/services/auth";
import loginBtn from "../../../../public/login_button.svg";
import loginFace from "../../../../public/login_face.svg";
import loginApple from "../../../../public/Group 48095648.svg";
import {useTranslation} from "react-i18next";

function SignupPage() {
    const router = useRouter();
    const {t, i18n} = useTranslation("common");
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChecked, setIsChecked] = useState(true);
    const {token, loading, socialLogin} = useAuth();


    if (loading) {
        return <SplashScreen/>
    }
    if (token) {
        router.push('/');
    }


    function handleLogin() {
        // Social login
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (!isChecked) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        try {
            const response = await createUser({first_name: firstName, last_name: lastName, email, password});
            toast.success('User created successfully');
            // Handle successful signup (e.g., redirect to login)
            router.replace("/signin");
        } catch (error) {
            console.error('Error during signup:', error);
            const lastKey = Object.keys(error.response.data.errors)[0];
            toast.error(JSON.stringify(error.response.data.errors[lastKey]));
        }
    };
    const handleGoogleSignIn = () => {
        // signIn("google", { callbackUrl: "http://localhost:3000/api/auth/callback/google" });
        socialLogin('google');
    };

    return <div id={`signup-page`}
                className={`w-full h-full flex flex-col items-center justify-start bg-white`}>
        <LogoWithBlueName/>
        <SignupInputs
            firstName={firstName}
            setFirstName={setFirstname}
            lastName={lastName}
            setLastName={setLastname}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
        />
        <div onClick={handleSignup} className={`w-full px-3 mt-8`}>
            <ActionButton text={`${t("SignUp")}`}/>
        </div>
        <div className={`flex items-center justify-center w-full px-12 mt-8 `}>
            <span className="flex-grow h-0.5 bg-lightDark"></span>
            <div className="mx-4 text-gray-600">{t("OrContinue")}</div>
            <span className="flex-grow h-0.5 bg-lightDark"></span>
        </div>
        <div className={`w-full flex flex-col items-center justify-center mt-4 px-10`}>
            <Image  onClick={handleGoogleSignIn} style={{cursor: "pointer"}} src={loginBtn} alt={``} width={400} height={40}/>
            {/*<Image style={{cursor: "pointer"}} className={`my-4`}*/}
            {/*       src={loginFace} alt={``} width={400} height={40}/>*/}
            {/*<Image style={{cursor: "pointer"}} className={`my-0 mb-2`} src={loginApple} alt={``} width={400}*/}
            {/*       height={40}/>*/}

        </div>
        <div onClick={() => {
            router.push('/signin');
        }} className={`w-full h-full text-center mt-4 bg-white mb-20 text-blue-600 cursor-pointer`}>
            {t("AlreadyHaveAccount")} ? <span className={`w-full px-2 max-h-12 underline`}>{t("SignIn")}</span>
        </div>
    </div>;
}

export default SignupPage;