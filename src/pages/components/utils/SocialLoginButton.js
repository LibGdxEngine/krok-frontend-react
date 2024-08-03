// components/SocialLoginButton.js

import React, {useState} from 'react';
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import Image from "next/image";
import loginBtn from "../../../../public/login_button.svg";
import loginFace from "../../../../public/login_face.svg";
import loginApple from "../../../../public/apple-icon.webp";

const SocialLoginButton = ({provider, clientId, redirectUri}) => {
    const router = useRouter();
    const [error, setError] = useState(null);

    const handleSocialLogin = async () => {
        const authUrl = getAuthUrl(provider, clientId, redirectUri);
        console.log(authUrl)
        window.location.href = authUrl;
    };

    const getAuthUrl = (provider, clientId, redirectUri) => {
        const baseUrls = {
            google: `https://accounts.google.com/o/oauth2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=email profile`,
            facebook: `https://www.facebook.com/dialog/oauth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=email`,
            apple: `https://appleid.apple.com/auth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=email name`,
        };
        return baseUrls[provider];
    };

    return (
        <div className={`mt-4`} onClick={handleSocialLogin}>
            {provider === "google" ?<Image style={{cursor: "pointer"}} src={loginBtn} alt={``} width={440} height={40}/> : null}
            {provider === "facebook" ?<Image style={{cursor: "pointer"}} src={loginFace} alt={``} width={440} height={40}/> : null}
            {provider === "apple" ?<Image style={{cursor: "pointer"}} src={loginApple} alt={``} width={440} height={40}/> : null}

        </div>
    );
};

export default SocialLoginButton;
