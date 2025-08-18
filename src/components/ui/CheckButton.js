import {useState} from "react";
import unchecked from "../../../public/tickcircle.svg";
import checked from "../../../public/tickcircleunchecked.svg";
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
                className={`flex items-center justify-between px-2 py-2 border border-0.5 border-ldarkBlue m-3
                min-w-[100px] max-w-[250px] h-auto min-h-[10px] transition-colors hover:bg-gray-50`}>
        <Image className={`mr-2 sm:mr-1 w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0`} src={state} width={20} height={20} alt={``}/>

        <span className={`w-full text-black text-base sm:text-sm font-medium text-center  line-clamp-2`}>
            {text}
        </span>
    </div>;
}

export default CheckButton;