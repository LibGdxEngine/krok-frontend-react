import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { getToken, socialAuth } from "@/components/services/auth";
import SignInPage from "@/pages/components/Auth/SignInPage";
import SplashScreen from "@/pages/components/SplashScreen";
import Link from "next/link";
import NavBar from "@/pages/components/NavBar";
import Footer from "@/pages/components/Footer";
import SocialLoginButton from "@/pages/components/utils/SocialLoginButton";
import loginLogo from "../../public/loginLogo.svg";
import woman from "../../public/woman.svg";
import loginIcons1 from "../../public/login_icons_1.svg";
import loginIcons2 from "../../public/login_icons_2.svg";
import loginIcons3 from "../../public/login_icons_3.svg";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, token, loading } = useAuth();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    if (accessToken) {
      socialAuth("provider", accessToken)
        .then((response) => {
          toast.success("Logged in successfully");
          login(response.token);
          router.push("/");
        })
        .catch((error) => {
          console.error("Error during social login:", error);
        });
    }
  }, []);

  if (loading) {
    return <SplashScreen />;
  }
  if (token) {
    router.push("/home");
  }

  const handleSignIn = async (e) =>  {
    e.preventDefault();
    try {
      const response = await getToken({ email, password });
      login(response.token);
      router.replace("/home");
    } catch (error) {
      toast.error("Invalid credentials", error.toString());
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col`}>
      <div className={`hidden sm:block`}>
        <SignInPage />
      </div>
      <div className={`sm:hidden`}>
        <NavBar />
        <div
          className="w-full h-full  relative min-h-screen bg-no-repeat bg-contain"
          style={{ backgroundImage: "url(/login_bg.svg)" }}
        >
          <div className={`w-full h-full   flex items-center justify-center`}>
            <div
              className={`w-full h-full relative flex flex-col items-center justify-center`}
            >
              <div className={`w-32 mt-10`}>
                <Image src={loginLogo} alt={``} width={200} height={200} />
              </div>
              <div className={`w-72 ms-10 mt-10`}>
                <Image src={woman} alt={``} width={250} height={250} />
              </div>
              <Image
                src={loginIcons1}
                alt={``}
                width={155}
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
            <div className={`w-full h-screen `}>
              <div className="w-full  flex flex-col justify-center items-center min-h-screen py-12 px-4">
                <h1 className="text-5xl font-thin mb-8">Sign In</h1>
                <div
                  className={`w-full flex flex-col items-center justify-center`}
                >
                  <SocialLoginButton
                    provider="facebook"
                    clientId="YOUR_FACEBOOK_CLIENT_ID"
                    redirectUri="YOUR_REDIRECT_URI"
                  />
                  <SocialLoginButton
                    provider="google"
                    clientId="YOUR_GOOGLE_CLIENT_ID"
                    redirectUri="YOUR_REDIRECT_URI"
                  />
                </div>

                <form
                  onSubmit={handleSignIn}
                  className="w-[60%] mt-20 flex flex-col space-y-6"
                >
                  <div className="flex flex-col">
                    <label htmlFor="email" className="mb-2 text-sm font-medium">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="shadow-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="password" className="mb-2 text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        placeholder="Enter your password"
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="terms" className="mr-2" />
                    <label htmlFor="terms" className="text-sm">
                      I accept the terms of use and privacy policy
                    </label>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      type={`submit`}
                      style={{
                        width: "80%",
                        borderRadius: "17px",
                        backgroundColor: "#4E8CDB",
                      }}
                      className="w-full bg-indigo-600 text-white px-4 p-4 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <p className="text-sm mt-6 text-center">
                  Do not have any account?{" "}
                  <Link
                    href="/signup"
                    style={{fontSize:"17px"}}
                    className="text-indigo-600 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Signin;
