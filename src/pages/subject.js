import { useRouter } from "next/router";

import ActionButton from "@/components/ui/ActionButton";
import CheckButton from "@/components/ui/CheckButton";
import Footer from "@/components/layout/Footer";
import NavBar from "@/pages/components/NavBar";
import StepBar from "@/pages/components/utils/StepBar";
import { useEffect, useState } from "react";
import { getSubjects } from "@/components/services/questions";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import { useTranslation } from "react-i18next";
import NavbarContainer from "../components/layout/NavbarContainer";
const Subject = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const { token, loading } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [state, setState] = useState(null);

  useEffect(() => {
    setState(JSON.parse(localStorage.getItem("state")));
  }, []);

  useEffect(() => {
    if (token && state) {
      getSubjects(token, state).then((response) => {
        setSubjects(response);
      }).catch((error) => {
        console.error('Error fetching years:', error);
      });
    }
  }, [token, state]);

  function handleNext() {
    if (selectedSubjects.length === 0) {
      if (toast.isActive) {
        toast.dismiss();
        toast.error("Please select at least one subject");
      }

      return;
    }
      ["subjects", "systems", "topics", "years"].forEach(k => delete state[k]);
    localStorage.setItem("state", JSON.stringify({ ...state, "subjects": selectedSubjects }));
    router.push("/filter");
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-start justify-start bg-white`}
    >
      <NavbarContainer />


      <div
        className={`w-full h-full flex flex-col items-center justify-center p-8 my-[100px] md:my-[50px]`}
      >
        <div
          className={`w-full h-full  flex flex-col items-start justify-center pt-0 md:pt-0`}
        >
          <StepBar
            stepNumber={2}
            onStepClicked={(step) => {
              router.push(`/${step}`);
            }}
          />
            <div
            className={`w-fit min-h-[100px] max-h-[60vh] overflow-y-auto bg-white rounded-lg shadow p-4 
              grid grid-cols-6 gap-2 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 mt-10`}
          >
            {subjects.map((subject, index) => {
              return (
                <CheckButton
                  text={subject.name}
                  key={index}
                  isSelected={selectedSubjects.includes(subject.id)}
                  onClick={() => {
                    if (selectedSubjects.includes(subject.id)) {
                      setSelectedSubjects(
                        selectedSubjects.filter((item) => item !== subject.id)
                      );
                    } else {
                      setSelectedSubjects([...selectedSubjects, subject.id]);
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

export default Subject;