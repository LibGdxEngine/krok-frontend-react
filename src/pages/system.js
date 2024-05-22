import {useRouter} from "next/router";

import ActionButton from "@/pages/components/utils/ActionButton";
import CheckButton from "@/pages/components/utils/CheckButton";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import StepBar from "@/pages/components/utils/StepBar";
import {useAuth} from "@/pages/components/utils/AuthContext";
import {useEffect, useState} from "react";
import {getSystems} from "@/pages/components/services/questions";

const System = () => {

    const router = useRouter();
    const {token, loading} = useAuth();
    const [state, setState] = useState(null);
    const [selectedSystems, setSelectedSystems] = useState([]);
    const [systems, setSystems] = useState([]);


    useEffect(() => {
        setState(JSON.parse(localStorage.getItem("state")));
    }, []);

    useEffect(() => {
        if (token) {
            getSystems(token).then((response) => {
                setSystems(response);
            }).catch((error) => {
                console.error('Error fetching systems:', error);
            });
        }
    }, [token]);

    function handleNext() {
        localStorage.setItem("state", JSON.stringify({...state, selectedSystems}));
        router.push("/topic");
    }

    return <div className={`w-full h-fit flex flex-col items-start justify-start bg-white`}>

        <NavBar/>
        <div className={`flex flex-col items-start mx-20`}>
            <div className={`w-full h-full flex flex-col items-start justify-start  pt-20`}>
                <StepBar stepNumber={3}/>
                <div className={`w-full grid grid-cols-6 mt-10`}>
                    {systems.map((system, index) => {
                        return <CheckButton text={system.name} key={index}
                                            onClick={() => setSelectedSystems([...selectedSystems, system.id])}
                                            />
                    })}
                </div>
                <div onClick={handleNext} id={`next-btn`} className={`w-1/2 mt-10`}>
                    <ActionButton text={`Next`}/>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
};

export default System;