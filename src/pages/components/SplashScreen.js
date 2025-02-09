import Image from "next/image";
import logo from "../../../public/logo.svg";

function SplashScreen() {
    return <div className={`splash-background w-[100vw] h-[100vh] flex flex-col items-center justify-center`}>
        <Image src={logo} alt={``}/>
        <div className={`text-white text-2xl mt-2`}>KROK PLUS</div>
    </div>;
}

export default SplashScreen;