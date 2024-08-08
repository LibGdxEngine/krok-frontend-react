// pages/Profile.js
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Sidebar from "/src/pages/components/Profile/Sidebar";
import Image from "next/image";
import profileImage from "../../public/profile.svg";
import NavBar from "@/pages/components/NavBar";
import Footer from "@/pages/components/Footer";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/pages/components/SplashScreen";
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
import FavCard from "@/pages/components/Favourites/FavCard";
import { toast } from "react-toastify";
import QuestionCard from "@/pages/components/Favourites/QuestionCard";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";

const PersonalInfo = React.memo(({ user, universities }) => {
  const [profileData, setProfileData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    university: user.university,
    phone_number: user.phone_number,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useAuth();

  return (
    <div className="w-full min-h-screen flex-1 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white  rounded-lg mt-10 p-8">
        <div className="w-full flex items-center justify-start">
          <Image
            className="w-24 h-24 rounded-full mx-auto"
            src={profileImage}
            width={150}
            height={150}
            alt="Profile Picture"
          />
        </div>
        <div className={`w-full flex items-center justify-center`}>
          <div className="w-full mt-6 me-2">
            <input
              type="text"
              value={profileData.first_name}
              onChange={(e) =>
                setProfileData({ ...profileData, first_name: e.target.value })
              }
              placeholder="Fi borderrst Name"
              className="mt-1 border me-2 py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
              style={{ color: "#1B459C" }}
            />
          </div>
          <div className="w-full mt-6 ms-2">
            <input
              value={profileData.last_name}
              type="text"
              onChange={(e) =>
                setProfileData({ ...profileData, last_name: e.target.value })
              }
              placeholder="La borderst Name"
              className="mt-1 border ps-2 py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
              style={{ color: "#1B459C" }}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            value={profileData.email}
            type="email"
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            className="mt-1 border ps-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            style={{ color: "#1B459C" }}
            placeholder="Email"
          />
        </div>
        <div className="w-full mt-6 me-2">
          <label className="block text-sm font-medium text-gray-700">
            University
          </label>
          <select
            value={profileData.university}
            onChange={(e) =>
              setProfileData({ ...profileData, university: e.target.value })
            }
            style={{ color: "#1B459C" }}
            className="mt-1 me-2 border py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          >
            {universities.map((university) => (
              <option key={university.id} value={university.name}>
                {university.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 relative">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            onChange={(e) =>
              setProfileData({ ...profileData, password: e.target.value })
            }
            className="mt-1 border ps-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            style={{ color: "#1B459C" }}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <div className="mt-4 relative">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) =>
              setProfileData({ ...profileData, password2: e.target.value })
            }
            placeholder="Confirm Password"
            className="mt-1 border ps-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            style={{ color: "#1B459C" }}
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => {
              updateProfile(token, profileData)
                .then((response) => {
                  toast.success("Profile updated successfully");
                })
                .catch((error) => {
                  toast.error("Error updating profile");
                });
            }}
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border
                                 border-transparent shadow-sm text-sm font-medium rounded-md
                                  text-white bg-navyBlue hover:bg-indigo-500 focus:outline-none focus:ring-2
                                   focus:ring-offset-2 focus:ring-navyBlue"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
});
PersonalInfo.displayName = "PersonalInfo";

const History = React.memo(({ examObject: defaultExams }) => {
  const router = useRouter();
  const { token, loading } = useAuth();
  const [examObject, setExamObject] = useState(defaultExams);

  if (loading || !examObject) {
    return <SplashScreen />;
  }
  if (examObject[0] === undefined){
    return <div className={`w-full h-full`}>

    </div>
  }
  const first_question = examObject[0]["questions"][0];
  const level = first_question.level.name;
  const language = first_question.language.name;
  const specificity = first_question.specificity.name;

  return (
    <div className="w-full min-h-screen flex-1 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-10 p-8">
        <h1 className="text-2xl font-bold mb-6">History</h1>
        <div className="space-y-4">
          {examObject.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold">
                    {level} {language} {specificity} Exam
                  </h1>
                  <h2 className="text-lg ">Type ({item.type} mood)</h2>
                  <p className="text-gray-500">
                    {(parseInt(item.current_question) / item.questions.length) *
                      100}
                    % Completed
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      router.push(
                        `/quiz?id=${item.id}&q=${parseInt(
                          item.current_question
                        )}`
                      );
                    }}
                    className={`bg-blue-500 text-white px-3 py-1 rounded-md ${
                      (parseInt(item.current_question) /
                        item.questions.length) *
                        100 ===
                      100
                        ? "hidden"
                        : ""
                    }`}
                  >
                    Resume studying
                  </button>
                  <button
                    onClick={() => {
                      deleteExamJourney(token, item.id).then((response) => {
                        setExamObject(
                          examObject.filter((exam) => exam.id !== item.id)
                        );
                      });
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (parseInt(item.current_question) /
                        item.questions.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
History.displayName = "History";

const Notes = React.memo(() => {
  const router = useRouter();
  const [notes, setNotes] = useState(null);
  const { token, loading } = useAuth();

  useEffect(() => {
    if (token) {
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
    <div className="w-full min-h-screen flex-1 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-10 p-8">
        <h1 className="text-2xl font-bold mb-6">Notes</h1>
        <div className="space-y-4">
          {notes &&
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-end"
              >
                <div className={`w-full`}>
                  <div className={`w-full bg-blue-100 rounded-full px-4`}>
                    Q-{note.question.text}
                  </div>
                  <div className={`px-4 mt-2`}>{note.note_text}</div>
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
            ))}
        </div>
      </div>
    </div>
  );
});
Notes.displayName = "Notes";

const Favourites = React.memo(({ favourites: myFav }) => {
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
        <div className="w-full h-fit mt-10 flex-1 flex flex-row flex-wrap justify-center gap-6 items-center">
          <div className={`w-full`}>
            <button
              onClick={() => setShowQuestions(false)}
              className={`w-fit px-2 mx-20 text-start text-red-700 rounded-full border-2 border-red-700`}
            >
              X
            </button>
          </div>
          {selectedFavourite.questions.map((question, index) => (
            <QuestionCard
              key={index}
              number={index + 1}
              question={question.text}
              answers={question.answers}
              correctAnswer={question.correct_answer.answer}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-fit mt-10 flex-1 flex flex-row flex-wrap justify-center gap-6 items-center">
          {favourites.length === 0 ? (
            <h1 className={`text-3xl mt-20`}>No favourites found</h1>
          ) : (
            ""
          )}
          {favourites.map((item, index) => (
            <FavCard
              key={index}
              title={item.name}
              numOfQuestions={item.questions.length}
              onDeleteClicked={() => {
                deleteFavouritesList(token, item.pkid).then((response) => {
                  toast.success("Favourite deleted successfully");
                  setFavourites(favourites.filter((fav) => fav.id !== item.id));
                });
              }}
              onShowQuestionsClicked={() => {
                setShowQuestions(!showQuestions);
                setSelectedFavourite(item);
              }}
            />
          ))}
        </div>
      )}
    </>
  );
});
Favourites.displayName = "Favourites";

const Profile = React.memo(() => {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [universities, setUniversities] = useState([]);
  const [selectedTap, setSelectedTap] = useState("profile");
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
          setExamObject(response);
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
    <div className="w-full flex flex-col items-center justify-center">
      <div className={`w-full hidden md:block`}>
        <SearchBar />
        <SectionsHeader />
      </div>
      <div className="block lg:hidden w-full">
        <NavBar />
        <div className={`w-full flex sm:flex-col`}>
          <Sidebar
            user={user}
            onTapClicked={(tap) => setSelectedTap(tap)}
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
});
Profile.displayName = "Profile";
export default Profile;
