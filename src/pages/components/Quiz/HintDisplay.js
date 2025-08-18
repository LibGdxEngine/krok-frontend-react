import { useState } from "react";
import { useTranslation } from "react-i18next"; // Assuming you're using i18next
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const HintDisplay = ({ questions, showHint }) => {
    const { t } = useTranslation();
    const [hintLoading, setHintLoading] = useState(false);
    const [hint, setHint] = useState(null);

    const API_KEY = process.env.GOOGLE_API_KEY; // Get API key from .env.local

    // Use the correct class from LangChain's Google Generative AI integration
    const model = new ChatGoogleGenerativeAI({
        apiKey: 'AIzaSyD3UhQzSqXGZDlKujE0H3aNzbbJjGuOLJU',
        model: "gemini-2.0-flash",
        maxOutputTokens: 2048,
    });

    // Define the output structure
    const parser = StructuredOutputParser.fromNamesAndDescriptions({
        hint: "A short hint to help the user answer the question.",
        relevant_answers: "A list of relevant answers from the original answer set that relate to the hint.",
    });
    
    const formatInstructions = parser.getFormatInstructions();
    
    // Create the prompt template
    const promptTemplate = PromptTemplate.fromTemplate(`
    Given a question with multiple answers, generate a helpful hint and identify the relevant answers.
    
    Question: {question}
    Answers: {answers}
    
    {format_instructions}
    `);
    
    // Generate a hint using the LLM
    async function generateHint() {
        
        if (!questions || !questions.text || !questions.answers) {
            console.error("Missing question data");
            return;
        }
        
        setHintLoading(true);
        
        try {
            // Create formatted prompt
            const formattedPrompt = await promptTemplate.format({
                question: questions.text,
                answers: questions.answers.join(", "),
                format_instructions: formatInstructions,
            });
            
            // Call the model
            const response = await model.invoke(formattedPrompt);
            
            // Parse the response
            const parsedResponse = await parser.parse(response.content);
            
            setHint(parsedResponse);
            setHintLoading(false);
            
            // Show the hint layer
            const hintLayer = document.querySelector("#hintLayer");
            if (hintLayer) {
                hintLayer.style.display = "flex";
            }
            
            return parsedResponse;
        } catch (error) {
            console.error("Error generating hint:", error);
            setHintLoading(false);
            return null;
        }
    }

    // Close the hint modal
    const closeHintModal = () => {
        const hintLayer = document.querySelector("#hintLayer");
        if (hintLayer) {
            hintLayer.style.display = "none";
        }
    };


    return (
        <>
            {showHint && (
                <div className="w-full rounded-xl p-4 mx-4 text-3xl text-center text-gray-500">
                    {hintLoading ? (
                        <p>Loading Hint...</p>
                    ) : questions.hint && questions.hint.trim() !== "" ? (
                        <div>
                            <h3 className="text-black font-medium text-[20px] mb-2">Hint Available</h3>
                            <button
                                onClick={() => {
                                    const hintLayer = document.querySelector("#hintLayer");
                                    if (hintLayer) {
                                        hintLayer.style.display = "flex";
                                    }
                                }}
                                className="bg-blue-500 text-[18px] text-white border-0 rounded-md px-4 py-2"
                            >
                                Show Hint
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={generateHint}
                            className="bg-blue-500 text-[18px] text-white border-0 rounded-md px-4 py-2"
                        >
                            Generate Hint
                        </button>
                    )}
                    <div
                        id="hintLayer"
                        style={{ display: "none" }}
                        className="fixed bg-black bg-opacity-20 z-[999999] top-0 start-0 end-0 bottom-0 justify-center items-center"
                    >
                        <div className="w-[40%] md:w-[90%] p-[32px] relative bg-white rounded-lg">
                            <h3 className="text-black font-bold text-[24px] text-center">
                                {hint?.hint || questions.hint || "No hint available"}
                            </h3>
                            {/* {hint?.relevant_answers && (
                                <div className="mt-4">
                                    <p className="text-gray-700 text-[18px] font-medium">Consider these answers:</p>
                                    <p className="text-gray-600 text-[16px]">{hint.relevant_answers}</p>
                                </div>
                            )} */}
                            <div className="absolute top-0 end-0 p-2">
                                <div
                                    onClick={closeHintModal}
                                    className="cursor-pointer"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="#0f0f0f"
                                            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HintDisplay;