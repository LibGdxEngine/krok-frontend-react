import Image from "next/image";
import app1 from "../../../public/Group 21.svg";
import app2 from "../../../public/Group 20.svg";
import telegram from "../../../public/social-telegram.svg";
import facebook from "../../../public/Vector.png";
import insta from "../../../public/Insta.png";
import youtube from "../../../public/youtube.png";


function Footer() {
    return <>
        <div id={`footer`} className={`bg-navyBlue w-full h-fit py-12 mt-0 z-20 flex sm:flex-col items-center`} style={{justifyContent:"space-around"}} >
            <div className={`w-fit flex sm:flex-col items-center justify-center`}>
                <Image className={`mx-10 sm:my-2`} src={app1} alt={``} width={150} height={150}/>
                <Image src={app2} alt={``} width={150} height={150}/>
            </div>
            <div className={`w-fit flex sm:my-2 items-center justify-center`} style={{gap:"15px"}} >
                <div style={{cursor: "pointer", width:"50px",height:"50px",borderRadius:"11px",backgroundColor:"#6999e1"}}>
                <Image width={25} src={telegram} alt={``} style={{transform:"translate(50%,50%)"}}  />
                </div>

                <div style={{cursor: "pointer", width:"50px",height:"50px",borderRadius:"11px",backgroundColor:"#6999e1"}}>
                <Image src={insta} alt={``} width={25} style={{transform:"translate(50%,50%)"}} />
                </div>

                <div style={{cursor: "pointer", width:"50px",height:"50px",borderRadius:"11px",backgroundColor:"#6999e1"}}>
                <Image src={youtube} alt={``} width={25}  style={{transform:"translate(50%,90%)"}} />
                </div>

                <div style={{cursor: "pointer", width:"50px",height:"50px",borderRadius:"11px",backgroundColor:"#6999e1"}}>
                <Image src={facebook} alt={``} width={15}  style={{transform:"translate(120%,40%)"}} />
                </div>
            </div>
            

        </div>
        <div className={`w-full h-10 bg-darkBlue text-center text-white text-xs flex items-center justify-center`}>
            All rights reserved to - KROK PLUS
        </div>
    </>;
}

export default Footer;