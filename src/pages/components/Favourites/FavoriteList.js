// components/FavoriteList.jsx
import {useEffect, useState} from 'react';
import NewFavoriteList from './NewFavoriteList';
import {addQuestionToFavoritesList, getFavouritesLists} from "@/components/services/questions";
import {useAuth} from "@/context/AuthContext";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

const FavoriteList = ({question, onItemAdded}) => {
    const {t, i18n} = useTranslation("common");
    const [selectedItem, setSelectedItem] = useState(null);
    const [items, setItems] = useState([]);
    const router = useRouter();
    const questionsId = router.query.q;
    const [isCreatingNewList, setCreatingNewList] = useState(false);
    const {token} = useAuth();

    useEffect(() => {
        getFavouritesLists(token).then((response) => {
            setItems(response);
        }).catch((error) => {
            console.error('Error fetching favorite lists:', error);
        });
    }, [token]);

    const handleAddToFavorites = () => {
        if (selectedItem) {
            addQuestionToFavoritesList(token, selectedItem, question.id).then((response) => {
                toast.success('Question added to favorite list');
            }).catch((error) => {
                toast.error('Error adding question to favorite list');
                console.error('Error adding question to favorite list:', error);
            });
            onItemAdded();
        } else {
            toast.error(t("PleaseEnterFavList"));
        }

    }

    const handleSelect = (pkid) => {
        setSelectedItem(pkid);
    };

    const handleSaveNewList = (name, pkid) => {
        const newItem = {pkid, name};
        setItems([...items, newItem]);
    };

    return (
        <div className="w-96 p-6 bg-white">
            <h2 className="text-2xl font-semibold text-black text-center mb-6">{t("AddToFavorite")}</h2>
            <div
                className="mb-4 p-4 bg-gray-100 rounded-lg flex items-center cursor-pointer"
                onClick={() => setCreatingNewList(true)}
            >
                <span className="text-gray-500 mr-2">+</span>
                <span className="text-gray-500">{t("CreateNewFavoriteList")}</span>
            </div>
            {items.map((item) => (
                <div
                    key={item.pkid}
                    className={`flex items-center p-4 mb-2 rounded-lg border ${selectedItem === item.pkid ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => handleSelect(item.pkid)}
                >
                    <input
                        type="radio"
                        checked={selectedItem === item.pkid}
                        onChange={() => handleSelect(item.pkid)}
                        className="form-radio text-blue-600"
                    />
                    <span className="ml-2 text-black">{item.name}</span>
                </div>
            ))}
            <button onClick={handleAddToFavorites}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 mt-4">{t("AddToFavoriteList")}
            </button>

            {isCreatingNewList && (
                <NewFavoriteList
                    onClose={() => setCreatingNewList(false)}
                    onSave={handleSaveNewList}
                />
            )}
        </div>
    );
};

export default FavoriteList;
