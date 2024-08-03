import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import {useAuth} from "@/context/AuthContext";
import {createExamJourney, getQuestionsCount} from "@/components/services/questions";
import ActionButtons from "@/pages/components/Questions/ActionButtons";
import QuestionsPractice from "@/pages/components/Questions/QuestionsPractice";
import QuestionsFilter from "@/pages/components/Questions/QuestionsFilter";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import KrokSpecifics from "@/pages/components/Questions/KrokSpecifics";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";

const Filter = () => {
    const router = useRouter();
    const {token, loading} = useAuth();
    const [state, setState] = useState(null);
    const [questionsCount, setQuestionsCount] = useState(0);
    const [numberOfSelectedQuestions, setNumberOfSelectedQuestions] = useState(0);

    useEffect(() => {
        const savedState = localStorage.getItem("state");
        if (savedState) {
            setState(JSON.parse(savedState));
        }
    }, []);

    useEffect(() => {
        if (token && state) {
            fetchQuestionsCount(token, state);
        }
    }, [token, state]);

    const fetchQuestionsCount = (token, state) => {
        getQuestionsCount(token, state)
            .then((response) => {
                setQuestionsCount(response.count);
                setNumberOfSelectedQuestions(response.count);
            })
            .catch((error) => {
                console.error("Error getting questions count:", error);
            });
    };

    const handleOnCreateJourneyClicked = (isExam) => {
        if(numberOfSelectedQuestions === 0){
            toast.error("Please select at least one question");
            return;
        }
        if(numberOfSelectedQuestions > questionsCount){
            toast.error("Selected questions count exceeds the available questions");
            return;
        }
        createExamJourney(token, {
            ...state,
            number_of_questions: numberOfSelectedQuestions,
            type: isExam ? "exam" : "study",
        })
            .then((response) => {
                router.push({
                    pathname: "/quiz",
                    query: {id: response.id},
                });
            })
            .catch((error) => {
                toast.error("Not enough questions to create a journey");
                console.error("Error creating journey:", error);
            });
    };

    const handleFilterChange = (updatedState) => {
        const newState = {
            ...state,
            is_used: updatedState['Unused Questions'] && !updatedState['Used Questions'] ? 'False' : updatedState['Used Questions'] && !updatedState['Unused Questions'] ? 'True' : undefined,
            is_correct: updatedState['Correct Questions'] && !updatedState['Incorrect Questions'] ? 'True' : updatedState['Incorrect Questions'] && !updatedState['Correct Questions'] ? 'False' : undefined
        };
        setState(newState);
    };

    return (
        <div className="w-full h-screen bg-white flex flex-col items-start justify-start">
            <div className="w-full hidden md:block">
                <SearchBar/>
                <SectionsHeader/>
            </div>
            <NavBar/>
            <div className="w-full">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-full px-6 pt-10">
                        <KrokSpecifics/>
                    </div>
                    {JSON.stringify()}
                    <div className="w-full grid grid-cols-2 md:grid-cols-1 gap-6 p-6 bg-white rounded-lg">
                        <QuestionsFilter onChange={handleFilterChange}/>
                        <div className="w-full flex flex-col items-start justify-end">
                            <QuestionsPractice
                                questionsCount={questionsCount}
                                selected={numberOfSelectedQuestions}
                                onChange={(number) => {
                                    setNumberOfSelectedQuestions(number);
                                }}
                            />
                            <ActionButtons onClick={handleOnCreateJourneyClicked}/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Filter;
