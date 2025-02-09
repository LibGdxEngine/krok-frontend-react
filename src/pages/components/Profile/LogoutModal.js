import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation("common");

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
          <div className="flex flex-col w-96 h-40 justify-center items-center">
            <h1 className="font-bold text-black text-lg mb-4">{t("AreYouSureLogout")}</h1>
            <div className="flex space-x-4">
              <button
                onClick={onConfirm}
                className="bg-red-500 text-white rounded-lg py-2 px-4"
              >
                {t("Confirm")}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 text-black rounded-lg py-2 px-4"
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
