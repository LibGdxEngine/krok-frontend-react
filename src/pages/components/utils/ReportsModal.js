// components/FavoritesModal.jsx
import {useEffect, useState} from 'react';
import FavoriteList from "@/pages/components/Favourites/FavoriteList";
import {useAuth} from "@/context/AuthContext";
import {createNewReport} from "@/components/services/questions";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";


const ReportsModal = ({isOpen, onClose, question}) => {
        const {t, i18n} = useTranslation("common");
        const {token, loading} = useAuth();
        const [report, setReport] = useState('');
        const handleSaveNote = () => {
            createNewReport(token, report, question).then((response) => {
                toast.success('Report sent successfully');
            }).catch((error) => {
                toast.error(`${error.response.data.non_field_errors[0]}`);
                console.error('Error adding question to list:', error);
            });
        };

        useEffect(() => {
            const handleEscape = (event) => {
                if (event.key === 'Escape') {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('keydown', handleEscape);
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
                <div className={`flex flex-col w-96 h-60 pb-10`}>
                  <h1 className={`font-bold text-black`}>
                    {t("WriteYourReport")}
                  </h1>
                  <input
                    value={report}
                    onChange={(e) => {
                      setReport(e.target.value);
                    }}
                    type="text"
                    className={`h-60 mt-4 px-2 text-black rounded-3xl bg-indigo-50 w-full`}
                  />
                  <button
                    onClick={() => {
                      handleSaveNote();
                      setReport("");
                      onClose();
                    }}
                    className={`bg-indigo-500 text-white rounded-lg py-2 px-4 mt-4`}
                  >
                    {t("Report")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
;

export default ReportsModal;
