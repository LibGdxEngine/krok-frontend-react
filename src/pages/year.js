import {useRouter} from "next/router";

import ActionButton from "@/pages/components/utils/ActionButton";
import CheckButton from "@/pages/components/utils/CheckButton";
import Footer from "@/pages/components/Footer";
import NavBar from "@/pages/components/NavBar";
import StepBar from "@/pages/components/utils/StepBar";
import React, {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {getYears} from "@/components/services/questions";
import {toast} from "react-toastify";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";

const Year = () => {

    const router = useRouter();
    const {token, loading} = useAuth();
    const [state, setState] = useState(null);
    const [selectedYears, setSelectedYears] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        if (token) {
            getYears(token).then((response) => {
                setYears(response);
            }).catch((error) => {
                console.error('Error fetching years:', error);
            });
        }
    }, [token]);

    useEffect(() => {
        setState(JSON.parse(localStorage.getItem("state")));
    }, []);


    function handleNext() {
        if (selectedYears.length === 0) {
            toast.error("Please select at least one year");
            return;
        }
        localStorage.setItem("state", JSON.stringify({...state, "years": selectedYears}));
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
                <StepBar stepNumber={1} onStepClicked={(step) => {
                    router.push(`/${step}`)
                }}/>
                <div className={`w-full grid grid-cols-6 sm:grid-cols-3 mt-10`}>
                    {years.map((year, index) => {
                        return <CheckButton text={year.year} key={index}
                                            onClick={() => setSelectedYears([...selectedYears, year.id])}
                        />
                    })}
                </div>
                <div onClick={handleNext} id={`next-btn`} className={`w-1/2 sm:w-full mt-10`} style={{alignSelf:"end"}}>
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

export default Year;