import ActionButtons from "@/pages/components/Questions/ActionButtons";
import QuestionsPractice from "@/pages/components/Questions/QuestionsPractice";
import QuestionsFilter from "@/pages/components/Questions/QuestionsFilter";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import KrokSpecifics from "@/pages/components/Questions/KrokSpecifics";
import {createExamJourney, getQuestionsCount} from "@/components/services/questions";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";

const Filter = () => {
    const router = useRouter();
    const {token, loading} = useAuth();
    const [state, setState] = useState(null);
    const [questionsCount, setQuestionsCount] = useState(0);
    const [numberOfSelectedQuestions, setNumberOfSelectedQuestions] = useState(0);

    useEffect(() => {
        setState(JSON.parse(localStorage.getItem("state")));
    }, []);

    useEffect(() => {
        if (token && state) {
            getQuestionsCount(token, state).then((response) => {
                setQuestionsCount(response.count);
                setNumberOfSelectedQuestions(response.count);
            }).catch((error) => {
                console.error('Error getting questions count:', error);
            });
        }
    }, [token, state]);


    const handleOnCreateJourneyClicked = (isExam) => {
        createExamJourney(token, {
            ...state,
            "number_of_questions": numberOfSelectedQuestions,
            "type": isExam ? "exam" : "study"
        }).then((response) => {
            router.push({
                pathname: '/quiz',
                query: {id: response.id}
            });
        }).catch((error) => {
            toast.error("No enough questions to create a journey");
            console.error('Error creating journey:', error);
        });
    }
    return <div className={`w-full h-screen bg-white flex  flex-col items-start justify-start`}>
        <div className={`w-full hidden md:block`}>
            <SearchBar/>
            <SectionsHeader/>
        </div>
        <NavBar/>
        <div className={`w-full h-full`}>

            <div className="w-full h-full  flex flex-col items-center justify-center">

                <div className={`w-full px-6 pt-10`}>
                    <KrokSpecifics/>
                </div>
                {/* {JSON.stringify(numberOfSelectedQuestions)} */}
                <div className="w-full grid grid-cols-2 md:grid-cols-1 gap-6 p-6 bg-white rounded-lg ">
                    <QuestionsFilter onChange={(event) => {
                        if (event['All'] === true) {
                        } else if (event['Unused Questions'] === event['Used Questions']) {
                        } else if (event['Correct Questions'] === event['Incorrect Questions']) {
                        } else {
                            if (event['Unused Questions']) {
                                setState({...state, "is_used": "False"});
                            } else if (event['Used Questions']) {
                                setState({...state, "is_used": "True"})
                            }
                            if (event['Correct Questions']) {
                                setState({...state, "is_correct": "True"})
                                console.log("true")
                            } else if (event['Incorrect Questions']) {
                                setState({...state, "is_correct": "False"})
                                console.log("false")
                            }
                        }
                    }}/>
                    <div className={`w-full flex flex-col items-start justify-end`}>
                        <QuestionsPractice questionsCount={questionsCount} selected={numberOfSelectedQuestions} onChange={(number) => {
                            setNumberOfSelectedQuestions(number);
                            setQuestionsCount(questionsCount);
                        }}/>
                        <ActionButtons onClick={handleOnCreateJourneyClicked}/>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
};

export default Filter;