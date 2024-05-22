import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {AuthProvider} from "@/pages/components/utils/AuthContext";

export default function App({Component, pageProps}) {
    return <>
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
        <ToastContainer/>
    </>
}
