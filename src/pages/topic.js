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

const Topic = () => {

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
        if(selectedTopics.length === 0) {
            toast.error("Please select at least one topic");
            return;
        }
        localStorage.setItem("state", JSON.stringify({...state,"topics": selectedTopics}));
        router.push("/filter");
    }

    return <div className={`w-full h-fit flex flex-col items-start justify-start bg-white`}>
        <div className={`w-full hidden md:block`}>
            <SearchBar/>
            <SectionsHeader/>
        </div>
        <NavBar/>

        <div className={`w-full flex flex-col items-start px-8`}>
            <div className={`w-full h-full flex flex-col items-start justify-start pt-20`}>
                <StepBar stepNumber={4} onStepClicked={(step) => {
                    router.push(`/${step}`)
                }}/>
                <div className={`w-full grid grid-cols-6 sm:grid-cols-3 mt-10`}>
                    {topics.map((topic, index) => {
                        return <CheckButton text={topic.name} key={index}
                                            onClick={() => setSelectedTopics([...selectedTopics, topic.id])}
                        />
                    })}
                </div>
                <div onClick={handleNext} id={`next-btn`} className={`w-1/2 sm:w-full mt-10`}>
                    <ActionButton text={`Next`}/>
                </div>
            </div>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <Footer/>
    </div>
};

export default Topic;