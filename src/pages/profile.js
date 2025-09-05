// pages/Profile.js
import React, { useEffect, useState } from "react";
import Sidebar from "/src/pages/components/Profile/Sidebar";
import Image from "next/image";
import profilePlaceHolder from "../../public/profile.svg";
import NavBar from "@/pages/components/NavBar";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/components/common/SplashScreen";
import {
  deleteExamJourney,
  deleteFavouritesList,
  getNotes,
  deleteNote,
  getFavouritesLists,
  getUserHistoryExams,
  updateProfile,
  getUniversities,
  getSpecificities,
} from "@/components/services/questions";
import {
  Check,
  Star,
  ArrowUp,
  Zap,
  BookOpen,
  Users,
  Baby,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Crown,
} from "lucide-react";
import FavCard from "@/pages/components/Favourites/FavCard";
import { toast } from "react-toastify";
import QuestionCard from "@/pages/components/Favourites/QuestionCard";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import userIcon from "../../public/profile.svg";
import LoadingSpinner from "@/pages/components/utils/LoadingSpinner";
import { useTranslation } from "react-i18next";
import NavbarContainer from "../components/layout/NavbarContainer";
import { parsePhoneNumber } from "libphonenumber-js"; // Ensure you have this installed: npm install libphonenumber-js
import axiosInstance from "@/components/axiosInstance";

const PersonalInfo = React.memo(({ user, universities }) => {
  const { t, i18n } = useTranslation("common");
  const [profileImage, setProfileImage] = useState(user.profile_photo);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    university: user.university,
    phone_number: user.phone_number,
    profile_photo: user.profile_photo,
  });

  const { token } = useAuth();
  const photo =
    profileImage === null || profileImage?.length <= 30
      ? profilePlaceHolder
      : profileImage;

  const handleImageClick = () => {
    document.getElementById("profileImageInput").click();
  };

  const getLastErrorMessage = (error) => {
    if (
      !error ||
      typeof error !== "object" ||
      Object.keys(error).length === 0
    ) {
      return "An unknown error occurred";
    }

    // Get the last key in the error object
    const keys = Object.keys(error);
    const lastKey = keys[keys.length - 1];
    // Get the first message for this key (assuming it's an array of messages)
    const errorMessages = error[lastKey];

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
      return errorMessages[0];
    }

    return "An unknown error occurred";
  };

  // Handle file input change and convert to base64
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileData({ ...profileData, profile_photo: base64String }); // Store the base64 string
        setProfileImage(base64String); // Update the image preview
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  };

  const validatePhoneNumber = () => {
    try {
      const parsedNumber = parsePhoneNumber(profileData.phone_number);

      if (!parsedNumber) {
        toast.error("Invalid phone number format or country code is missing.");
        return false;
      }

      if (!parsedNumber.country) {
        toast.error("Country code is missing from the phone number.");
        return false;
      }

      return true;
    } catch (error) {
      toast.error("Invalid phone number format or country code is missing.");
      return false;
    }
  };

  return (
    <div className="w-full mb-10 flex-1 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-10 p-8">
        <div className="w-full sm:w-fit flex items-center justify-start">
          <Image
            style={{ cursor: "pointer" }}
            className="w-24  h-24  rounded-full mx-2 sm:w-16 sm:h-16"
            src={photo}
            width={150}
            height={150}
            alt="Profile Picture"
            onClick={handleImageClick}
          />
          <div className="w-full">
            <h1 className="text-2xl font-bold text-black">
              {profileData.first_name} {profileData.last_name}
            </h1>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }} // Hide the file input
            onChange={handleFileChange}
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="w-full mt-6 me-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("FirstName")}
            </label>
            <input
              type="text"
              value={profileData.first_name} // Use profileData here
              onChange={(e) => {
                setProfileData({
                  ...profileData,
                  first_name: e.target.value,
                });
              }}
              placeholder="First Name"
              className="mt-1 me-2 py-2 text-black px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 placeholder-black focus:ring-gray-500 sm:text-sm"
            />
          </div>
          <div className="w-full mt-6 ms-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("LastName")}
            </label>
            <input
              type="text"
              value={profileData.last_name} // Use profileData here
              onChange={(e) => {
                setProfileData({ ...profileData, last_name: e.target.value });
              }}
              placeholder="Last Name"
              className="mt-1 ps-2 py-2 text-black px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 placeholder-black focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="w-full mt-6 me-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("University")}
            </label>
            <select
              value={profileData.university} // Use profileData here
              onChange={(e) =>
                setProfileData({ ...profileData, university: e.target.value })
              }
              className="mt-1 me-2 py-2 px-4 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 placeholder-black focus:ring-gray-500 sm:text-sm"
            >
              {universities.map((university) => (
                <option key={university.id} value={university.name}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full mt-6 ms-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("PhoneNumber")}
            </label>
            <input
              type="phone"
              value={profileData.phone_number} // Use profileData here
              onChange={(e) => {
                setProfileData({
                  ...profileData,
                  phone_number: e.target.value,
                });
              }}
              placeholder="Phone Number"
              className="mt-1 ps-2 py-2 text-black px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 placeholder-black focus:ring-gray-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            {t("Email")}
          </label>
          <input
            type="email"
            value={profileData.email} // Use profileData here
            onChange={(e) => {
              setProfileData({ ...profileData, email: e.target.value });
            }}
            className="mt-1 ps-2 py-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 placeholder-black focus:ring-indigo-500 sm:text-sm"
            placeholder="Email"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            {t("NewPassword")}
          </label>
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => {
              setProfileData({ ...profileData, password: e.target.value });
            }}
            className="mt-1 ps-2 py-2 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 placeholder-black focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mt-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <button
              onClick={() => {
                if (!validatePhoneNumber()) {
                  return;
                }
                setIsLoading(true);
                updateProfile(token, profileData)
                  .then((response) => {
                    toast.success("Profile updated successfully");
                    setIsLoading(false);
                  })
                  .catch((error) => {
                    const err = getLastErrorMessage(error.response.data);
                    toast.error(err);
                    setIsLoading(false);
                  });
              }}
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-navyBlue hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navyBlue"
            >
              {t("Save")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
  PersonalInfo.displayName = "PersonalInfo";
});

const History = React.memo(({ examObject: defaultExams }) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const { token, loading } = useAuth();
  const [examObject, setExamObject] = useState(defaultExams);
  if (loading || !examObject) {
    return <SplashScreen />;
  }

  let level = null;
  let language = null;
  let specificity = null;
  let year = null;

  const calculateScorePercentage = (questions, totalQuestions) => {
    const values = Object.values(questions); // Extract object values
    // const totalQuestions = values.length; // Total number of questions
    // If there are no questions, return 0.0 to avoid division by zero.
    if (totalQuestions === 0) {
      return 0.0;
    }

    const correctAnswers = values.filter(
      (item) => item.is_correct === true
    ).length; // Count correct answers

    const percentage = (correctAnswers / totalQuestions) * 100; // Calculate percentage

    const formattedPercentage = parseFloat(percentage.toFixed(1)); // Format to one decimal place

    // Check if the formattedPercentage is a real number or NaN
    if (isNaN(formattedPercentage)) {
      console.error("Error: The calculated percentage is not a number.");
      return 0.0; // or any default value you prefer
    }

    return formattedPercentage;
  };

  function sortStudiesByCreatedAt(studies) {
    return studies.slice().sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA; // Sort in descending order (most recent first)
    });
  }

  const sortedStudies = sortStudiesByCreatedAt(examObject);

  return (
    <div className="w-full bg-white flex-1 flex flex-col items-center">
      {examObject.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className={`text-3xl mt-20 text-black`}>{t("NoHistory")}</h1>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      ) : (
        <div
          className={`w-full max-w-4xl bg-white shadow-md rounded-lg mt-10 p-8`}
        >
          <h1 className="text-2xl font-bold mb-6 text-black">{t("History")}</h1>
          <div className="space-y-4">
            {[...sortedStudies].map((item, index) => {
              const first_question = item.first_question;
              level = first_question?.level;
              language = first_question?.language;
              specificity = first_question?.specificity;
              year = first_question?.year;
              return (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-xl font-semibold text-black">
                        {level} {language} {specificity} {year} {t("Exam")}
                      </h1>
                      <h2 className="text-lg text-black">
                        Type ({item.type} mood)
                      </h2>
                      <div className={`flex `}>
                        <p className="text-gray-500 me-2">
                          {parseFloat(
                            (
                              (parseInt(Object.keys(item.progress).length) /
                                item.questions) *
                              100
                            ).toFixed(1)
                          )}
                          % Completed
                        </p>
                        -
                        <p className="text-gray-500 mx-2">
                          {" "}
                          Score{" "}
                          {calculateScorePercentage(
                            item.progress,
                            item.questions
                          ) + "%"}{" "}
                        </p>
                      </div>
                    </div>
                    <div className="flex  space-x-2 md:space-x-0 sm:flex-col sm:space-y-2 items-center sm:items-center sm:justify-center">
                      <button
                        onClick={() => {
                          router.push(
                            `/quiz?id=${item.id}&q=${
                              (parseInt(Object.keys(item.progress).length) /
                                item.questions) *
                                100 ==
                              100
                                ? item.progress.length - 1
                                : item.progress.length
                            }`
                          );
                        }}
                        className={`h-fit bg-blue-500 text-white px-3 py-1 rounded-md sm:text-xs ${
                          (parseInt(Object.keys(item.progress).length) /
                            item.questions.length) *
                            100 ===
                          100
                            ? "hidden"
                            : ""
                        }`}
                      >
                        {t("ResumeStudy")}
                      </button>
                      <button
                        onClick={() => {
                          deleteExamJourney(token, item.id).then((response) => {
                            setExamObject(
                              examObject.filter((exam) => exam.id !== item.id)
                            );
                          });
                        }}
                        className="w-full bg-red-500 sm:text-xs text-white px-3 py-1 rounded-md"
                      >
                        {t("Delete")}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (item.progress.length / item.questions) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
  History.displayName = "History";
});

const Notes = React.memo(() => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [notes, setNotes] = useState(null);
  const { token, loading } = useAuth();
  useEffect(() => {
    if (token) {
      // fetch notes
      getNotes(token)
        .then((response) => {
          setNotes(response);
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
        });
    }
  }, [token]);
  return (
    <div className="w-full bg-white flex-1 flex flex-col items-center">
      {notes && notes.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className={`text-3xl mt-20 text-black`}>{t("NoNotes")}</h1>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      ) : (
        <div
          className={`w-full max-w-4xl bg-white shadow-md rounded-lg mt-10 p-8`}
        >
          <h1 className="text-2xl font-bold mb-6 text-black">{t("Notes")}</h1>
          <div className="space-y-4">
            {notes &&
              notes.map((note, index) => {
                return (
                  <div
                    key={note.id}
                    className="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-end"
                  >
                    <div className={`w-full `}>
                      <div
                        className={`w-full bg-blue-100 rounded-lg px-4 text-black`}
                      >{`Q- ${note.question.text}`}</div>

                      <p className="mt-4 text-green-700">
                        Correct Answer: {note.correct_answer}
                      </p>
                      <div className={`px-4 mt-2 text-black`}>
                        {note.note_text}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        deleteNote(token, note.id).then((response) => {
                          setNotes(notes.filter((n) => n.id !== note.id));
                          toast.success("Note deleted successfully");
                        });
                      }}
                      className="bg-red-500 text-white py-1 rounded-md mt-2 px-4"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
  Notes.displayName = "Notes";
});

const Favourites = React.memo(({ favourites: myFav }) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const { token, loading } = useAuth();
  const [favourites, setFavourites] = useState(myFav);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedFavourite, setSelectedFavourite] = useState(null);

  if (loading || !favourites) {
    return <SplashScreen />;
  }
  return (
    <>
      {showQuestions ? (
        <div className="w-full  bg-white my-10 flex-1 flex flex-row flex-wrap justify-center gap-6 items-center">
          <div className={`w-full `}>
            <button
              onClick={() => {
                setShowQuestions(false);
              }}
              className={`w-fit px-2 mx-20 text-start text-red-700 rounded-full border-2 border-red-700`}
            >
              X
            </button>
          </div>

          {selectedFavourite.questions.map((question, index) => {
            return (
              <QuestionCard
                key={index}
                number={index + 1}
                question={question.text}
                answers={question.answers}
                // correctAnswer={question.correct_answer.answer}
              />
            );
          })}
        </div>
      ) : (
        <div className="w-full h-fit  mt-10 flex-1 flex flex-row flex-wrap justify-center gap-6 items-start">
          {favourites.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h1 className={`text-3xl mt-20 text-black`}>
                {t("NoFavourite")}
              </h1>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          ) : (
            ""
          )}
          {favourites.map((item, index) => {
            return (
              <FavCard
                key={index}
                title={item.name}
                numOfQuestions={item.questions.length}
                onDeleteClicked={() => {
                  deleteFavouritesList(token, item.pkid).then((response) => {
                    toast.success("Favourite deleted successfully");
                    setFavourites(
                      favourites.filter((fav) => fav.id !== item.id)
                    );
                  });
                }}
                onShowQuestionsClicked={() => {
                  setShowQuestions(!showQuestions);
                  setSelectedFavourite(item);
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
  Favourites.displayName = "Favourites";
});

const MyPlan = () => {
  const plans = [
    {
      name: "FREE",
      description:
        "FREE PLAN - Perfect for beginners starting their learning journey",
      monthlyPrice: 0,
      yearlyPrice: 290,
      features: [
        "Search functionality",
        "Save questions",
        "Comment on questions",
        "Copy questions",
        "Access explanation videos",
        "View hints",
        "Save exams for later",
      ],
      color: "lightGreen",
      icon: Baby,
      popular: false,
    },
    {
      name: "Basic",
      description: "3 Months - Everything is open",
      monthlyPrice: 20,
      yearlyPrice: 290,
      features: [
        "Unlimited course access",
        "4K video quality",
        "Dedicated account manager",
        "Custom learning paths",
        "Team management tools",
        "Advanced reporting",
        "API access",
        "White-label options",
        "Priority support",
        "Custom integrations",
      ],
      color: "lightGreen",
      icon: BookOpen,
      popular: false,
    },
    {
      name: "Plus",
      description: "6 Months - Everything is open",
      monthlyPrice: 30,
      yearlyPrice: 790,
      features: [
        "Unlimited course access",
        "4K video quality",
        "Dedicated account manager",
        "Custom learning paths",
        "Team management tools",
        "Advanced reporting",
        "API access",
        "White-label options",
        "Priority support",
        "Custom integrations",
      ],
      color: "greenCard",
      icon: Zap,
      popular: true,
    },
    {
      name: "Prime",
      description: "12 Months - Everything is open",
      monthlyPrice: 40,
      yearlyPrice: 1490,
      features: [
        "Unlimited course access",
        "4K video quality",
        "Dedicated account manager",
        "Custom learning paths",
        "Team management tools",
        "Advanced reporting",
        "API access",
        "White-label options",
        "Priority support",
        "Custom integrations",
      ],
      color: "darkGreen",
      icon: Award,
      popular: false,
    },
  ];

  const [myPlan, setMyPlan] = useState(null);
  const { token, loading } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    if (token) {
      axiosInstance
        .get("/v1/my-subscription", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          setMyPlan(response.data[0].id);
        })
        .catch((error) => {
          console.error("Error fetching my plan:", error);
        });
    }
  }, [token]);

  const handleSubscribe = async (planId) => {
    if (!token) {
      toast.warning("You need to sign in first");
      router.push("/signin");
      return;
    }
    try {
      console.log("Subscribing to plan ID:", planId);
      const response = await axiosInstance.post(
        "/v1/create-subscription/",
        {
          plan_id: planId,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // redirect user to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
    }
  };

  if (loading || myPlan == null || myPlan == undefined) {
    return <SplashScreen />;
  }

  const currentPlan = plans[myPlan];
  const PlanIcon = currentPlan.icon;

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-bold text-5xl md:text-6xl font-Poppins mb-6 bg-gradient-to-r from-darkGreen via-midGreen to-greenCard bg-clip-text text-transparent">
            My Current Plan
          </h1>
          <p className="text-mildGray">
            Your subscription details and available plans
          </p>
        </div>
        {/* Current Plan */}
        <div className="relative border-2 border-greenCard shadow-xl rounded-xl bg-slate-50 text-black overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-16 translate-x-16"></div>

          <div className="relative p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-6 rounded-2xl bg-greenCard text-white shadow-lg`}
              >
                <PlanIcon className="w-12 h-12" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h2 className="text-4xl font-bold">{currentPlan.name}</h2>
                  {currentPlan.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-500 text-yellow-900 rounded">
                      <Star className="w-3 h-3" />
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-lg mb-4">{currentPlan.description}</p>
                <div className="text-5xl font-bold font-Poppins text-darkGreen">
                  €{currentPlan.monthlyPrice}{" "}
                  <span className="text-base font-normal">/ month</span>
                </div>
                <div className="text-mildGray mt-1">
                  or €{currentPlan.yearlyPrice} yearly
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-center">
                What&apos;s Included
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-greenCard flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg border border-gray-100 bg-white rounded-lg">
          <div className="text-center p-6">
            <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-black">
              <Crown className="w-7 h-7 text-yellow-500" />
              Upgrade Your Plan
            </h2>
            <p className="text-black mt-2">
              Get more value with our premium plans
            </p>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`flex lg:flex-col items-center lg:items-start justify-between lg:justify-start p-4 rounded-lg border-2 transition-all ${
                    plan.name === currentPlan.name
                      ? "border-blue-500 bg-blue-50"
                      : plan.isUpgrade
                      ? "border-green-200 bg-green-50 hover:border-green-300"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex lg:flex-col lg:w-full items-center lg:items-start gap-4 lg:gap-2">
                    <div
                      className={`w-4 h-4 lg:hidden rounded-full bg-greenCard`}
                    ></div>
                    <div className="lg:w-full">
                      <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-1">
                        <span className="font-semibold text-lg lg:text-base md:text-sm text-black lg:mb-1">
                          {plan.name}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 lg:gap-1">
                          {plan.name === currentPlan.name && (
                            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                              Current
                            </span>
                          )}
                          {plan.name === "Plus" && (
                            <span className="flex items-center gap-1 bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
                              <Star className="w-4 h-4 lg:w-3 lg:h-3" />
                              <span className="md:hidden">Best Deal</span>
                              <span className="hidden md:inline">Best</span>
                            </span>
                          )}
                          {index > myPlan && (
                            <span className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              <ArrowUp className="w-4 h-4 lg:w-3 lg:h-3" />
                              Upgrade
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm lg:text-xs md:text-xs text-gray-600 lg:mt-2">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right lg:text-left lg:w-full lg:mt-3 lg:pt-3 lg:border-t lg:border-gray-200">
                    <div className="text-2xl lg:text-xl md:text-lg font-bold text-black lg:mb-2">
                      €{plan.monthlyPrice}
                    </div>
                    {index > myPlan && (
                      <button
                        className="mt-2 lg:mt-0 px-3 py-1 md:px-2 md:py-1 bg-blue-600 text-white text-sm md:text-xs font-medium rounded-md transition-colors lg:w-full"
                        onClick={() => handleSubscribe(index)}
                      >
                        <span className="sm:hidden">Upgrade Now</span>
                        <span className="hidden sm:inline">Upgrade</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = React.memo(() => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [universities, setUniversities] = useState([]);
  const [selectedTap, setSelectedTap] = React.useState("profile");
  const [examObject, setExamObject] = useState(null);
  const [favourites, setFavourites] = useState(null);

  useEffect(() => {
    if (token) {
      getFavouritesLists(token)
        .then((response) => {
          setFavourites(response);
        })
        .catch((error) => {
          console.error("Error fetching favourites:", error);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getUserHistoryExams(token)
        .then((response) => {
          setExamObject(response.results);
        })
        .catch((error) => {
          console.error("Error fetching exam:", error);
        });
    }
  }, [token]);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/signin");
    }
    if (!loading && token) {
      // fetch notes
      getUniversities(token)
        .then((response) => {
          setUniversities(response);
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
        });
    }
  }, [token, loading, router]);

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <SplashScreen />;
  }

  return (
    <div className="w-full  bg-white flex flex-col items-center justify-center">
      <NavbarContainer />
      <div className={`w-full flex md:flex-col`}>
        <Sidebar
          user={user}
          onTapClicked={(tap) => {
            setSelectedTap(tap);
          }}
          currentTap={selectedTap}
        />
        <div className={`w-full`}>
          <div
            className={`transition-container ${
              selectedTap === "profile" ? "show" : ""
            }`}
          >
            {selectedTap === "profile" && (
              <PersonalInfo
                key="profile"
                user={user}
                universities={universities}
              />
            )}
          </div>
          <div
            className={`transition-container ${
              selectedTap === "history" ? "show" : ""
            }`}
          >
            {selectedTap === "history" && (
              <History key="history" examObject={examObject} />
            )}
          </div>
          <div
            className={`transition-container ${
              selectedTap === "favorite" ? "show" : ""
            }`}
          >
            {selectedTap === "favorite" && (
              <Favourites key="favorite" favourites={favourites} />
            )}
          </div>
          <div
            className={`transition-container ${
              selectedTap === "notes" ? "show" : ""
            }`}
          >
            {selectedTap === "notes" && <Notes key="notes" />}
          </div>
          <div
            className={`transition-container ${
              selectedTap === "myPlan" ? "show" : ""
            }`}
          >
            {selectedTap === "myPlan" && <MyPlan key="myPlan" />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
});
Profile.displayName = "Profile";
export default Profile;
