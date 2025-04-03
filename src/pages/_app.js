import { appWithTranslation } from "next-i18next";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";
import i18n from "../../i18n";
import { CartProvider } from "@/context/CartContext";

function App({ Component, pageProps }) {
  return (
    <div className={`bg-light`}>
      <SessionProvider session={pageProps.session}>
        <AuthProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </AuthProvider>
        <ToastContainer />
      </SessionProvider>
    </div>
  );
}

export default appWithTranslation(App);
