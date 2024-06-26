import {useRouter} from "next/router";

import ActionButton from "@/pages/components/utils/ActionButton";
import CheckButton from "@/pages/components/utils/CheckButton";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import StepBar from "@/pages/components/utils/StepBar";
import {useEffect, useState} from "react";
import {getSubjects} from "@/components/services/questions";
import {useAuth} from "@/context/AuthContext";
import {toast} from "react-toastify";

const Subject = () => {
    const router = useRouter();
    const {token, loading} = useAuth();
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [state, setState] = useState(null);

    useEffect(() => {
        setState(JSON.parse(localStorage.getItem("state")));
    }, []);

    useEffect(() => {
        if (token) {
            getSubjects(token).then((response) => {
                setSubjects(response);
            }).catch((error) => {
                console.error('Error fetching years:', error);
            });
        }
    }, [token]);

    function handleNext() {
        if(selectedSubjects.length === 0) {
            toast.error("Please select at least one subject");
            return;
        }
        localStorage.setItem("state", JSON.stringify({...state,"subjects": selectedSubjects}));
        router.push("/filter");
    }

    return <div className={`w-full h-fit flex flex-col items-start justify-start bg-white`}>

        <NavBar/>

        <div className={`flex flex-col items-start mx-20`}>
            <div className={`w-full h-full flex flex-col items-start justify-start  pt-20`}>
                <StepBar stepNumber={2} onStepClicked={(step) => {
                    router.push(`/${step}`)
                }}/>
                <div className={`w-full grid grid-cols-6 mt-10`}>
                    {subjects.map((subject, index) => {
                        return <CheckButton text={subject.name} key={index}
                                            onClick={() => setSelectedSubjects([...selectedSubjects, subject.id])}
                        />
                    })}
                </div>
                <div onClick={handleNext} id={`next-btn`} className={`w-1/2 mt-10`}>
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

export default Subject;