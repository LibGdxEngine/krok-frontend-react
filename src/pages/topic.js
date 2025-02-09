import {useRouter} from "next/router";

import ActionButton from "@/pages/components/utils/ActionButton";
import CheckButton from "@/pages/components/utils/CheckButton";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import StepBar from "@/pages/components/utils/StepBar";
import {useAuth} from "@/context/AuthContext";
import {useEffect, useState} from "react";
import {getTopics} from "@/components/services/questions";
import {toast} from "react-toastify";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import { useTranslation } from "react-i18next";
import NavbarContainer from "./components/NavbarContainer";
const Topic = () => {
    const { t, i18n } = useTranslation("common");
    const router = useRouter();
    const {token, loading} = useAuth();
    const [state, setState] = useState(null);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        setState(JSON.parse(localStorage.getItem("state")));
    }, []);

    useEffect(() => {
        if (token && state) {
            getTopics(token, state).then((response) => {
                setTopics(response);
            }).catch((error) => {
                console.error('Error fetching topics:', error);
            });
        }
    }, [token, state]);

    function handleNext() {
        if (selectedTopics.length === 0) {
              if (toast.isActive) {
                toast.dismiss();
                toast.error("Please select at least one topic");
              }
            
            return;
        }
        localStorage.setItem("state", JSON.stringify({...state, "topics": selectedTopics}));
        router.push("/filter");
    }

    return (
      <div
        className={`w-full flex flex-col items-start justify-start `}
      >
        <NavbarContainer/>
        <div className={`w-full h-full flex flex-col items-start p-8 my-[100px] md:my-[50px]`}>
          <div
            className={`w-full h-full flex flex-col items-start justify-center md:pt-0`}
          >
            <StepBar
              stepNumber={4}
              onStepClicked={(step) => {
                router.push(`/${step}`);
              }}
            />
            <div
              className={`sm:w-full grid grid-cols-6 lg:grid-cols-2 md:grid-cols-2 mt-10`}
            >
              {topics.map((topic, index) => {
                return (
                  <CheckButton
                    text={topic.name}
                    key={index}
                    isSelected={selectedTopics.includes(topic.id)}
                    onClick={() => {
                      if (selectedTopics.includes(topic.id)) {
                        setSelectedTopics(
                          selectedTopics.filter((item) => item !== topic.id)
                        );
                      } else {
                        setSelectedTopics([...selectedTopics, topic.id]);
                      }
                    }}
                  />
                );
              })}
            </div>
            <div className={`h-fit  flex flex-row w-2/3`}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  router.replace("/start");
                }}
                id={`next-btn`}
                className={`w-1/3 sm:w-full mt-10`}
              >
                <ActionButton
                  text={`${t("Back")}`}
                  className={`!bg-gray-400`}
                />
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={handleNext}
                id={`next-btn`}
                className={`w-2/3 sm:w-full mt-10 mx-2`}
              >
                <ActionButton text={`${t("Next")}`} />
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Footer />
      </div>
    );
};

export default Topic;