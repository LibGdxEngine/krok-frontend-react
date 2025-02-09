// components/NewFavoriteList.jsx
import { useState } from 'react';
import {createFavoriteList} from "@/components/services/questions";
import {toast} from "react-toastify";
import {useAuth} from "@/context/AuthContext";
import {useTranslation} from "react-i18next";

const NewFavoriteList = ({ onClose, onSave }) => {
    const {t, i18n} = useTranslation("common");
    const [listName, setListName] = useState('');
    const {token, loading} = useAuth();
    const handleSave = () => {
        if (listName.trim()) {
            createFavoriteList(token, {name: listName}).then((response) => {
                toast.success('Favorite list created successfully');
                onSave(listName, response.pkid);
                onClose();
            }).catch((error) => {
                toast.error('Error creating favorite list');
                console.error('Error creating favorite list:', error);
                onClose();
            });

        }
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-60">
        <div className="w-96 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg p-6">
          <h2 className="text-2xl font-semibold text-black text-center mb-6">
            {t("CreateNewFavoriteList")}
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{t("Name")}</label>
            <input
              type="text"
              className="w-full p-2 border text-black border-gray-300 rounded-lg"
              placeholder={t("PleaseEnterFavList")}
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    );
};

export default NewFavoriteList;
