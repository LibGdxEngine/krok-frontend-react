import {useState} from "react";
import unchecked from "../../../../public/tickcircle.svg";
import checked from "../../../../public/tickcircleunchecked.svg";
import Image from "next/image";

function CheckButton({text, onClick = null, isSelected = false}) {
    const [isChecked, setIsChecked] = useState(isSelected);

    function handleOnClick() {
        setIsChecked(!isChecked);
        if (onClick) {
            onClick(isChecked);
        }
    }

    const state = isSelected ? unchecked : checked;
    return <div onClick={handleOnClick} style={{cursor: "pointer", borderRadius: "20.64px"}}
                className={`w-40 sm:w-32 sm:h-[28px] h-[50px] flex justify-between 
                items-center px-5 sm:px-8 py-1 border border-0.5 border-ldarkBlue my-2 mx-2`}>
        <Image className={`me-1 sm:hidden`} src={state} width={20} height={20} alt={``}/>
        <Image className={`me-1 hidden sm:block`} src={state} width={16} height={16} alt={``}/>

        <div className={`w-full text-center text-lg sm:text-xs text-black`}>
            {text}
        </div>
    </div>;
}

export default CheckButton;