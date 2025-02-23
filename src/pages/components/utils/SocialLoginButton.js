// components/SocialLoginButton.js

import React, {useState} from 'react';
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import Image from "next/image";
import loginBtn from "../../../../public/Group 26086666.svg";
import loginFace from "../../../../public/login_face.svg";
import loginApple from "../../../../public/Group 48095648.svg";

const SocialLoginButton = ({onClick = null, provider}) => {
    const router = useRouter();
    const [error, setError] = useState(null);

    return (
      <div className={`w-96 h-12 mt-4`} onClick={onClick}>
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
