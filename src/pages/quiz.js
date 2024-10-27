import QuestionWindow from "@/pages/components/Quiz/QuestionWindow";
import NavBar from "@/pages/components/NavBar";
import Footer from "@/pages/components/Footer";
import {useRouter} from "next/router";
import {useAuth} from "@/context/AuthContext";
import {useEffect, useState} from "react";
import {getExamJourney, updateExamJourney} from "@/components/services/questions";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import {useTranslation} from "react-i18next";

const Quiz = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  let { id, q } = router.query;
  if (!q) {
    q = 0;
  }

  const { token, loading } = useAuth();
  const [examObject, setExamObject] = useState(null);
  const [progress, setProgress] = useState(examObject?.progress);
  let length = examObject ? examObject.questions.length : 1;
  console.log(examObject?.progress);
  
  useEffect(() => {
    if (token && id) {
      getExamJourney(token, id)
        .then((response) => {
          setExamObject(response);
          setProgress(response.progress);
        })
        .catch((error) => {
          console.error("Error fetching exam:", error);
        });
    }
  }, [token, id]);

  // Function to update the exam object with new progress
  const handleProgressUpdate = (questionIndex, updatedProgress) => {
    setProgress((prev) => ({
      ...prev,
      [questionIndex]: updatedProgress,
    }));
    setExamObject((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [questionIndex]: updatedProgress,
      },
    }));
  };

  return (
    <div
      className={`w-full h-screen flex flex-col items-start justify-center bg-white`}
    >
      <div className={`w-full h-full hidden md:block`}>
        <SearchBar />
        <SectionsHeader />
      </div>
      <NavBar />

      <div className={`w-full h-full  items-start justify-center`}>
        {examObject && (
          <QuestionWindow
            examJourneyId={id}
            length={length}
            questions={examObject.questions[q]}
            numbers={Array.from({ length }, (v, i) => i + 1)}
            questionIndex={q}
            type={examObject.type}
            progress={progress}
            time={examObject.time_left ? examObject.time_left.toString() : null}
            onCheck={(selectedAnswerAsText, selectedAnswerIndex, time_left) => {
              updateExamJourney(token, id, {
                time_left,
                progress: {
                  ...examObject.progress,
                  [q.toString()]: {
                    question_text: examObject.questions[q].text,
                    answer: selectedAnswerIndex,
                  },
                },
                current_question_text: examObject.questions[q].text,
                current_question: parseInt(q) + 1,
              })
                .then((response) => {
                  console.log(response);
                  handleProgressUpdate(q.toString(), {
                    question_text: examObject.questions[q].text,
                    answer: selectedAnswerIndex,
                    is_correct: response.is_correct,
                    correct_answer: response.progress[q]["correct_answer"],
                    isDisabled: true,
                  });
                  if (q < length - 1 && examObject?.type === 'exam') {
                    router.push(`/quiz?id=${id}&q=${parseInt(q) + 1}`);
                  }
                })
                .catch((error) => {
                  console.error("Error updating exam:", error);
                });
            }}
          />
          
        )}
      </div>
      <Footer />
    </div>
  );
}
export default Quiz;