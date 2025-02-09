// components/FavoritesModal.jsx
import {useEffect, useState} from 'react';
import {useAuth} from "@/context/AuthContext";
import {createNewNote} from "@/components/services/questions";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";


const NotesModal = ({isOpen, onClose, question}) => {
        const {t, i18n} = useTranslation("common");
        const {token, loading} = useAuth();
        const [note, setNote] = useState('');
        const handleSaveNote = () => {
            createNewNote(token, note, question).then((response) => {
                toast.success('Note saved successfully');
            }).catch((error) => {
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
                    {t("WriteYourNote")}
                  </h1>
                  <input
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                    type="text"
                    className={`h-60 mt-4 px-2 text-black rounded-3xl bg-indigo-50 w-full`}
                  />
                  <button
                    onClick={() => {
                      handleSaveNote();
                      setNote("");
                      onClose();
                    }}
                    className={`bg-indigo-500 text-white rounded-lg py-2 px-4 mt-4`}
                  >
                    {t("Save")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
;

export default NotesModal;
