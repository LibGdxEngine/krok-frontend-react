// components/SocialLoginButton.js

import React, {useState} from 'react';
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import Image from "next/image";
import loginBtn from "../../../../public/Group 26086666.svg";
import loginFace from "../../../../public/login_face.svg";
import loginApple from "../../../../public/Group 48095648.svg";

const SocialLoginButton = ({provider, clientId, redirectUri}) => {
    const router = useRouter();
    const [error, setError] = useState(null);

    const handleSocialLogin = async () => {
        const authUrl = getAuthUrl(provider, clientId, redirectUri);
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
      <div className={`w-96 h-12 mt-4`} onClick={handleSocialLogin}>
        {provider === "google" ? (
          <Image
            style={{ cursor: "pointer" }}
            src={loginBtn}
            className="w-full my-2"
            alt={``}
            width={400}
            height={40}
          />
        ) : null}
        {provider === "facebook" ? (
          <Image
            style={{ cursor: "pointer" }}
            src={loginFace}
            className="w-full my-2"
            alt={``}
            width={400}
            height={40}
          />
        ) : null}
        {provider === "apple" ? (
          <Image
            style={{ cursor: "pointer" }}
            className="w-full my-2"
            src={loginApple}
            alt={``}
            width={400}
            height={40}
          />
        ) : null}
      </div>
    );
};

export default SocialLoginButton;
