import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import LogoWithBlueName from "../../public/logo.svg";
import { createUser } from "@/components/services/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/pages/components/SplashScreen";
import loginLogo from "../../public/loginLogo.svg";
import loginBtn from "../../public/login_button.svg";
import loginFace from "../../public/login_face.svg";
import woman from "../../public/woman.svg";
import Link from "next/link";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import SignupPage from "@/pages/components/Auth/SignupPage";

export default function SignUp() {
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
    router.push("/home");
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
      router.replace("/signin");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(JSON.stringify(error.response));
    }
  };

  return (
    <div className={`w-full flex flex-col`}>
      <div className={`hidden sm:block `}>
        <SignupPage />
      </div>
      <div className={`sm:hidden`}>
        <NavBar />
        <div
          className="relative min-h-screen bg-cover bg-no-repeat "
          style={{ backgroundImage: "url(/login_bg.svg)" }}
        >
          <div className={`w-full flex items-center justify-center`}>
            <div
              className={`w-full h-screen flex flex-col items-center justify-center`}
            >
              <div className={`w-32 mt-0`}>
                <Image src={loginLogo} alt={``} width={200} height={200} />
              </div>
              <div className={`w-full text-center font-light mt-5 px-20`}>
                <h1
                  style={{ fontSize: "60px" }}
                  className={`w-full text-white text-start`}
                >
                  Create Your Account
                </h1>
                <h6
                  style={{ letterSpacing: "15px" }}
                  className={`text-white text-4xl w-full text-start`}
                >
                  Fill in the form to create an account and start taking the
                  test.
                </h6>
              </div>
            </div>
            <div className={`w-full h-full `}>
              <div className="w-full  flex flex-col justify-center items-center min-h-screen py-12 px-4">
                <div>
                  <h1 className="text-5xl font-thin mb-8">Sign Up</h1>
                </div>
                <div
                  className={`w-full flex flex-col items-center justify-center`}
                >
                  <Image
                    style={{ cursor: "pointer" }}
                    src={loginBtn}
                    alt={``}
                    width={440}
                    height={40}
                  />
                  <Image
                    style={{ cursor: "pointer" }}
                    className={`my-4`}
                    src={loginFace}
                    alt={``}
                    width={440}
                    height={40}
                  />
                </div>
                <form
                  onSubmit={handleSignup}
                  className="w-[60%] flex flex-col space-y-6"
                >
                  <div className="flex flex-col">
                    <label
                      htmlFor="first_name"
                      className="mb-2 text-sm font-medium"
                    >
                      First Name
                    </label>
                    <input
                      style={{ border: "1px solid #E3E3E3" }}
                      type="text"
                      id="first_name"
                      value={firstName}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="shadow-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="email" className="mb-2 text-sm font-medium">
                      E-mail
                    </label>
                    <input
                      style={{ border: "1px solid #E3E3E3" }}
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="shadow-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="password"
                      className="mb-2 text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                      style={{ border: "1px solid #E3E3E3" }}
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
                  <div className="flex flex-col">
                    <label
                      htmlFor="password2"
                      className="mb-2 text-sm font-medium"
                    >
                      Re-Password
                    </label>
                    <div className="relative">
                      <input
                      style={{ border: "1px solid #E3E3E3" }}
                        type={showConfirmPassword ? "text" : "password"}
                        id="password2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="shadow-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                        placeholder="Enter your password again"
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </div>
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
                    <label htmlFor="terms" className="text-sm">
                      I accept the terms of use and privacy policy
                    </label>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      type={`submit`}
                      style={{
                        width: "100%",
                        borderRadius: "17px",
                        backgroundColor: "#4E8CDB",
                      }}
                      className="w-full bg-indigo-600 text-white px-4 p-2 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
                <p className="text-sm mt-6 text-center">
                  Do not have any account?{" "}
                  <Link
                    href="/signin"
                    style={{ fontSize: "17px" }}
                    className="text-indigo-600 hover:underline"
                  >
                    Sign In
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
