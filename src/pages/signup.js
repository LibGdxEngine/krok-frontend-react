import React, { useEffect, useState } from "react";
import Image from "next/image";
import LogoWithBlueName from "../../public/logo.svg";
import { createUser } from "@/components/services/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/pages/components/SplashScreen";
import loginLogo from "../../public/loginLogo.svg";
import loginBtn from "../../public/login_button.svg";
import loginFace from "../../public/login_face.svg";
import loginApple from "../../public/Group 48095648.svg";
import Link from "next/link";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import SignupPage from "@/pages/components/Auth/SignupPage";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }
  if (token) {
    router.push("/");
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!isChecked) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    try {
      const response = await createUser({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      toast.success("User created successfully");
      // Handle successful signup (e.g., redirect to login)
      router.replace("/signin");
    } catch (error) {
      console.error("Error during signup:", error);

      toast.error(error.response.data.errors.email[0]);
    }
  };

  return (
    <div className={`w-full flex flex-col`}>
      <div className={`hidden lg:block `}>
        <SignupPage />
        <Footer />
      </div>
      <div className={`lg:hidden`}>
        <NavBar />
        <div
          className="relative min-h-screen bg-cover bg-no-repeat  "
          style={{ backgroundImage: "url(/login_bg.svg)" }}
        >
          <div className={`w-full flex items-center justify-center`}>
            <div className={`w-full flex flex-col items-center justify-center`}>
              <div className={`w-32 mt-0`}>
                <Image src={loginLogo} alt={``} width={200} height={200} />
              </div>
              <div className={`w-full text-center font-light mt-5 px-20`}>
                <h1
                  style={{ fontSize: "60px" }}
                  className={`w-full text-white text-start`}
                >
                  {t("CreateYourAccount")}
                </h1>
                <h6
                  style={{ letterSpacing: "15px" }}
                  className={`text-white text-4xl w-full text-start`}
                >
                  {t("Fill")}
                </h6>
              </div>
            </div>
            <div className={`w-full`}>
              <div className="w-full  flex flex-col justify-center items-center min-h-screen py-12 px-4">
                <h1 className="text-5xl font-thin mb-8 text-black">
                  {t("SignUp")}
                </h1>
                <div
                  className={`w-full flex flex-col items-center justify-center`}
                >
                  {/*<Image*/}
                  {/*  style={{ cursor: "pointer" }}*/}
                  {/*  className={`my-4 w-96`}*/}
                  {/*  src={loginFace}*/}
                  {/*  alt={``}*/}
                  {/*  width={400}*/}
                  {/*  height={40}*/}
                  {/*/>*/}
                  {/*<Image*/}
                  {/*  style={{ cursor: "pointer" }}*/}
                  {/*  src={loginBtn}*/}
                  {/*  className="w-96"*/}
                  {/*  alt={``}*/}
                  {/*  width={400}*/}
                  {/*  height={40}*/}
                  {/*/>*/}

                  {/*<Image*/}
                  {/*  style={{ cursor: "pointer" }}*/}
                  {/*  className={`my-4 mb-2 w-96`}*/}
                  {/*  src={loginApple}*/}
                  {/*  alt={``}*/}
                  {/*  width={400}*/}
                  {/*  height={40}*/}
                  {/*/>*/}
                </div>
                <form
                  onSubmit={handleSignup}
                  className="w-[60%] flex flex-col space-y-2 mt-4"
                >
                  <div className="flex">
                    <div className={`flex flex-col`}>
                      <label
                        htmlFor="email"
                        className="mb-2 text-sm font-medium text-black"
                      >
                        {t("FirstName")}
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        value={firstName}
                        onChange={(e) => setFirstname(e.target.value)}
                        className="shadow-sm rounded-xl px-4 py-2 text-black  focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        placeholder={`${t("EnterFirstName")}`}
                      />
                    </div>
                    <div className={`flex flex-col mx-2`}>
                      <label
                        htmlFor="second_name"
                        className="mb-2 text-sm font-medium text-black"
                      >
                        {t("LastName")}
                      </label>
                      <input
                        type="text"
                        id="second_name"
                        value={lastName}
                        onChange={(e) => setLastname(e.target.value)}
                        className="shadow-sm rounded-xl px-4 py-2 text-black  focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        placeholder={`${t("EnterLastName")}`}
                      />
                    </div>
                  </div>
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
                      className="shadow-sm rounded-xl px-4 py-2 text-black  focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                      placeholder={`${t("EnterEmail")}`}
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
                        className="shadow-sm rounded-xl px-4 py-2 text-black focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        placeholder="Enter your password"
                      />
                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3 text-sm font-medium text-indigo-500"
                      >
                        {showPassword ? "Hide" : "Show"}{" "}
                        {/* Toggle button text */}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="password2"
                      className="mb-2 text-sm font-medium text-black"
                    >
                      Re-{t("Password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"} // Toggle between "text" and "password"
                        id="password2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow-sm rounded-xl px-4 py-2 text-black focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        placeholder="Confirm your password"
                      />
                      {/* Toggle Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-3 text-sm font-medium text-indigo-500"
                      >
                        {showConfirmPassword ? "Hide" : "Show"}{" "}
                        {/* Toggle button text */}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      value={isChecked}
                      onChange={(e) => {
                        setIsChecked(e.target.checked);
                      }}
                      type="checkbox"
                      id="terms"
                      className="mr-2"
                    />
                    <label htmlFor="terms" className="text-sm text-black">
                      {t("IAccept").split("privacy policy")[0]}
                      <Link href="/privacy-policy" legacyBehavior>
                        <a
                          style={{ textDecoration: "underline", color: "blue" }}
                        >
                          privacy policy
                        </a>
                      </Link>
                      {t("IAccept").split("privacy policy")[1]}
                    </label>
                  </div>
                  <button
                    type={`submit`}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {t("SignUp")}
                  </button>
                </form>
                <p className="text-sm mt-3 text-center text-black">
                  {t("DoNotHaveAccount")}{" "}
                  <Link
                    href="/signin"
                    className="text-indigo-600 hover:underline"
                  >
                    {t("SignIn")}
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
}
