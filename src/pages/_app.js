import {appWithTranslation} from 'next-i18next';
import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {AuthProvider} from "@/context/AuthContext";
import i18n from '../../i18n';

function App({Component, pageProps}) {
    return <div className={`bg-light`}>
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
        <ToastContainer/>
    </div>
};

export default appWithTranslation(App);