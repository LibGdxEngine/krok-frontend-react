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
import NavbarContainer from "@/pages/components/NavbarContainer";

const Search = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all"); // Default filter is "all"
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
      const response = await searchForquestions(token, searchQuery);
      
      setResults(response.results);
      // Apply current filter to new results
      applyFilter(response.results, activeFilter);
      
      if (response.results.length === 0) {
        handleError(t("no_Results"));
      }
    } catch (error) {
      console.log('error: searching' , error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filter to results
  const applyFilter = (resultsToFilter, filter) => {
    if (filter === "all") {
      setFilteredResults(resultsToFilter);
    } else {
      const filtered = resultsToFilter.filter(
        question => question.match_source[0] === filter
      );
      setFilteredResults(filtered);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilter(results, filter);
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

  // Filter options
  const filterOptions = [
    { id: "all", label: t("All") },
    { id: "question_text", label: t("Question Text") },
    { id: "answer", label: t("Answers") },
    { id: "correct_answer", label: t("Correct Answer") }
  ];

  return (
    <div className="w-full min-h-screen h-auto bg-gradient-to-r from-blue-500 to-purple-500 flex flex-col items-center start">
      {/* Toast Notifications */}
      <ToastContainer position="bottom-center" />

      {/* NavBar */}
      <NavbarContainer with_search_bar={false} />
      

      {/* Search Section */}
      <div className="w-full hidden lg:block mt-8">
        <SearchBar setQuery={setQuery} /> {/* Controlled search bar */}
      </div>

      <h1 className="text-4xl font-extrabold text-white my-8 text-center">
        {t("Search")}
      </h1>

      {/* Filter Section */}
      <div className="w-full max-w-xl mb-6">
        <div className="bg-white p-3 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-2 text-gray-700">{t("Filter by match location")}:</h3>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleFilterChange(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeFilter === option.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {option.label}
                {activeFilter === option.id && filteredResults.length > 0 && 
                  <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">
                    {filteredResults.length}
                  </span>
                }
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      <div className="w-full min-h-screen max-w-xl">
        {loading ? (
          <p className="text-white text-center">{t("Loading...")}</p>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <div
              key={result.id}
              className="p-4 bg-white rounded-lg shadow-lg mb-4 transform hover:scale-105 transition duration-300"
            >
              <QuestionCard question={result} searchTerm={query} />
            </div>
          ))
        ) : (
          query && (
            <p className="text-white text-center">
              {activeFilter !== "all" 
                ? t("No results match the selected filter") 
                : t("no_Results")}
            </p>
          )
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Search;
