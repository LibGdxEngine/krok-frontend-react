import {useState} from "react";
import Image from "next/image";
import arrowDown from "../../../../public/arrowdown2.svg";
import {useTranslation} from "react-i18next";


function FaqItem({question, answer}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="faq-item w-full flex flex-col mt-2 my-3 rounded-8">
            <div
                className="w-full h-12 max-h-screen border-[0.5px] px-2 rounded-8 flex flex-row items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className={`text-black`}>{question}</div>
                <Image
                    src={arrowDown}
                    alt=""
                    width={15}
                    height={15}
                    className={`transform ${expanded ? "rotate-180" : "rotate-0"}`}
                />
            </div>
            {expanded && (
                <div className="w-full px-2 flex items-start mt-4 mb-2 text-black">
                    {answer}
                </div>
            )}
        </div>
    );
}


function HomeFAQs() {
    const {t, i18n} = useTranslation("common");
    const faqData = [
        {
            question: "Question 1",
            answer: "Answer to question 1",
        },
        {
            question: "Question 2",
            answer: "Answer to question 2",
        },
        {
            question: "Question 3",
            answer: "Answer to question 3",
        },
        // Add more questions and answers as needed
    ];

    return (
        <div id="faqs" className="mx-28 sm:mx-4 mt-2">
            <div className="w-full font-bold mb-10 sm:mb-2 text-4xl sm:text-2xl text-black">
                {t("FAQ")}
            </div>
            <div className="w-full h-full grid grid-cols-2 gap-4 lg:grid-cols-1">
                {faqData.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer}/>
                ))}
            </div>
        </div>
    );
}

export default HomeFAQs;