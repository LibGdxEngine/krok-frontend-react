import Image from "next/image";
import logo from "../../../../public/logo.svg";

function LogoWithBlueName() {
    return <div id={`logo-with-blue-name`} className={`flex flex-col items-center justify-between`}>
        <Image src={logo} alt={``}/>
        <div className={`text-xl text-navyBlue mt-2 font-semibold`}>KROK PLUS</div>
    </div>;
}
export default LogoWithBlueName;