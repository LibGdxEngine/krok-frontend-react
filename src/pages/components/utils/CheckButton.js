import {useState} from "react";
import unchecked from "../../../../public/tickcircle.svg";
import checked from "../../../../public/tickcircleunchecked.svg";
import Image from "next/image";

function CheckButton({text, onClick = null}) {
    const [isChecked, setIsChecked] = useState(false);

    function handleOnClick() {
        setIsChecked(!isChecked);
        if(onClick){
            onClick(isChecked);
        }
    }

    const state = isChecked ? unchecked : checked;
    return <div onClick={handleOnClick} style={{cursor: "pointer"}}
                className={`w-fit flex justify-between px-5 py-1 mx-2 border border-0.5 border-ldarkBlue rounded-2xl my-2 `}>
        <Image className={`me-10`} src={state} width={15} height={15} alt={``}/>
        <div className={``}>
            {text}
        </div>
    </div>;
}

export default CheckButton;