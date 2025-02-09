import Image from "next/image";
import searchIcon from "../../../../public/searchIcon.svg";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {useRouter} from "next/router";
import {useAuth} from "@/context/AuthContext";

function SearchBar() {
    const [inputValue, setInputValue] = useState('');
    const router = useRouter();
    const {token} = useAuth();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            console.log(inputValue.trim());
            
            router.push({
                pathname: '/search',
                query: { query: inputValue.trim() }
            });
        }
    };

    return <div id={`search-bar`} className={`w-full relative px-5 mt-2`}>
        <input type={"text"}
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               className={`w-full h-full py-2 border border-lightDark focus:border-lightDark outline-none rounded-8 px-2 ps-10`}
               placeholder={`Search`}>
        </input>
        {inputValue && (
            <button onClick={handleSubmit}
                    className="absolute right-7 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-lg px-4">
                Search
            </button>
        )}
        <Image src={searchIcon} alt={`search`} className={`absolute p-1 left-10 top-[5%] -translate-x-[50%]`}
               icon={faSearch}/>
    </div>;
}

export default SearchBar;