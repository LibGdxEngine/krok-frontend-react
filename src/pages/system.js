import { useRouter } from "next/router";

import ActionButton from "@/components/ui/ActionButton";
import CheckButton from "@/components/ui/CheckButton";
import Footer from "@/components/layout/Footer";
import NavBar from "@/pages/components/NavBar";
import StepBar from "@/pages/components/utils/StepBar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getSystems } from "@/components/services/questions";
import { toast } from "react-toastify";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import { useTranslation } from "react-i18next";
import NavbarContainer from "../components/layout/NavbarContainer";
const System = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const { token, loading } = useAuth();
  const [state, setState] = useState(null);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [systems, setSystems] = useState([]);


  useEffect(() => {
    setState(JSON.parse(localStorage.getItem("state")));
  }, []);

  useEffect(() => {
    if (token && state) {
      getSystems(token, state).then((response) => {
        setSystems(response);
      }).catch((error) => {
        console.error('Error fetching systems:', error);
      });
    }
  }, [token, state]);

  function handleNext() {
    if (selectedSystems.length === 0) {
      if (toast.isActive) {
        toast.dismiss();
        toast.error("Please select at least one system");
      }

      return;
    }
      ["subjects", "systems", "topics", "years"].forEach(k => delete state[k]);
    localStorage.setItem("state", JSON.stringify({ ...state, "systems": selectedSystems }));
    router.push("/filter");
  }

  return (
    <div
      className={`w-full h-full flex flex-col items-start justify-start bg-white`}
    >
      <NavbarContainer />

      <div className={`w-full h-full flex flex-col items-start p-8 my-[100px] md:my-[50px]`}>
        <div
          className={`w-full h-full flex flex-col items-start justify-center md:pt-0`}
        >
          <StepBar
            stepNumber={3}
            onStepClicked={(step) => {
              router.push(`/${step}`);
            }}
          />
          <div
            className={`w-fit min-h-[100px] max-h-[60vh] overflow-y-auto bg-white rounded-lg shadow p-4 
              grid grid-cols-6 gap-2 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 mt-10`}
          >
            {systems.map((system, index) => {
              return (
                <CheckButton
                  text={system.name}
                  key={index}
                  isSelected={selectedSystems.includes(system.id)}
                  onClick={() => {
                    if (selectedSystems.includes(system.id)) {
                      setSelectedSystems(
                        selectedSystems.filter((item) => item !== system.id)
                      );
                    } else {
                      setSelectedSystems([...selectedSystems, system.id]);
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
      <Footer />
    </div>
  );
};

export default System;