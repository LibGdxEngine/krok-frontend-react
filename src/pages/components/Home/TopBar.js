import Image from "next/image";
import user from "../../../../public/profile.svg";
import notificationsIcon from "../../../../public/notification_icon.svg";

function TopBar() {
    return <div id={`top-bar`} className={`w-full flex items-center justify-between px-5 py-2`}>
        <div id={`profile-icon-container`} className={`w-full flex items-center justify-start `}>
            <Image width={35} height={35} src={user} alt={`profile`} objectFit={`cover`}
                   className={`w-10 h-10 rounded-full me-2`}/>
            <div className={`flex flex-col`}>
                <div className={`text-xs text-navyBlue`}>
                    Hello, User
                </div>
                <div className={`text-sm text-navyBlue`}>
                    Welcome Back
                </div>
            </div>
        </div>
        <div id={`notification-icon-container`}>
            <Image className={`w=8 h-8`} src={notificationsIcon} alt={``}/>
        </div>
    </div>;
}
export default TopBar;