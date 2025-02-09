import React, { useEffect, useState, useCallback } from "react";
import NavBar from "@/pages/components/NavBar";
import Footer from "@/pages/components/Footer";

import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import QuestionCard from "@/pages/components/Questions/QuestionCard";
import { useRouter } from "next/router";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import { searchForquestions } from "@/components/services/questions";

const Search = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Error Handling function
  const handleError = (message) => {

    // toast.error(message);
  };

  // Perform search query
  const performSearch = async (searchQuery) => {


    if (searchQuery.length < 3 && searchQuery.length > 0) {
      handleError(t("Search query must be at least 3 characters long"));
      return;
    }

    try {
      setLoading(true);
      console.log(searchQuery);
      const response = await searchForquestions(token, searchQuery);
      console.log('response:' + response);
      
      setResults(response.results);
      if (response.results.length === 0) {
        handleError(t("no_Results"));
      }
    } catch (error) {
      console.log('error: searching' , error);
      
      // console.error("Error searching for questions:", error);
      // handleError(t("An error occurred during the search"));
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function to prevent making API requests on every keystroke
  const debouncedSearch = useCallback(
    debounce((value) => performSearch(value), 500),
    []
  );

  // Effect to watch query parameter from the URL and trigger search
  useEffect(() => {
    if (router.query.query) {
      setQuery(router.query.query); // Correctly set the query from the URL
      performSearch(router.query.query); // Perform initial search
    }
  }, [router.query.query]); // Watch for changes in query and token

  // Effect to perform search when the query state changes
  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  return (
    <div className="w-full min-h-screen h-auto  bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center start">
      {/* Toast Notifications */}
      <ToastContainer position="bottom-center" />

      {/* NavBar */}
      <NavBar />

      {/* Search Section */}
      <div className="w-full hidden lg:block mt-8">
        <SearchBar setQuery={setQuery} /> {/* Controlled search bar */}
      </div>

      <h1 className="text-4xl font-extrabold text-white my-8 text-center">
        {t("Search")}
      </h1>

      {/* Search Results Section */}
      <div className="w-full min-h-screen max-w-xl">
        {loading ? (
          <p className="text-white text-center">{t("Loading...")}</p>
        ) : results.length > 0 ? (
          results.map((result) => (
            <div
              key={result.id}
              className="p-4 bg-white rounded-lg shadow-lg mb-4 transform hover:scale-105 transition duration-300"
            >
              <QuestionCard question={result} />
            </div>
          ))
        ) : (
          query && (
            <p className="text-white text-center">{t("no_Results")}</p>
          )
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Search;
