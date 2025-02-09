// components/FavoritesModal.jsx
import { useEffect } from 'react';
import FavoriteList from "@/pages/components/Favourites/FavoriteList";
import {useTranslation} from "react-i18next";


const FavoritesModal = ({ isOpen, onClose, question}) => {
    const {t, i18n} = useTranslation("common");
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
                    <FavoriteList question={question} onItemAdded={()=>{
                        onClose();
                    }} />
                </div>
            </div>
        </div>
    );
};

export default FavoritesModal;
