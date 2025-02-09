import QuestionWindow from "@/pages/components/Quiz/QuestionWindow";
import NavBar from "@/pages/components/NavBar";
import Footer from "@/pages/components/Footer";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  getExamJourney,
  updateExamJourney,
} from "@/components/services/questions";
import SearchBar from "@/pages/components/Home/SearchBar";
import SectionsHeader from "@/pages/components/SectionsHeader";
import { useTranslation } from "react-i18next";
import NavbarContainer from "./components/NavbarContainer";

const Quiz = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const makeMyProgress = (progress) => {
    const newProgress = {};
    if (!progress || progress.length === 0) {
      return {};
    }
    for (let i = 0; i < progress.length; i++) {
      newProgress[progress[i].id.toString()] = progress[i];
    }
    return newProgress;
  };

  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [examObject, setExamObject] = useState(null);
  const [progress, setProgress] = useState(
    makeMyProgress(examObject?.progress)
  );
  const [reviewExam, setReviewExam] = useState(false);
  let { id, q } = router.query;
  const [currentQuestion, setcurrentQuestion] = useState(q ? q : 0);
  let length = examObject ? examObject.questions.length : 1;
  if (!q) {
    q = currentQuestion;
  }
  console.log(q);
  const rearrangeArrayById = (mainArray, priorityArray) => {
    // Extract elements from mainArray whose ids match those in priorityArray
    const prioritized = priorityArray
      .map((priorityItem) =>
        mainArray.find((mainItem) => mainItem.id === priorityItem.id)
      )
      .filter(Boolean); // Remove undefined values in case of unmatched ids

    // Get the remaining elements in mainArray whose ids are not in priorityArray
    const remaining = mainArray.filter(
      (mainItem) =>
        !priorityArray.some((priorityItem) => priorityItem.id === mainItem.id)
    );

    // Concatenate prioritized and remaining elements
    return [...prioritized, ...remaining];
  };
  useEffect(() => {
    if (token && id) {
      setLoading(true);
      getExamJourney(token, id)
        .then((response) => {
          const newArrayOfQWuistions = rearrangeArrayById(
            response.questions,
            response.progress
          );
          console.log(response.questions);

          response.questions = newArrayOfQWuistions;
          console.log(newArrayOfQWuistions);

          setExamObject(response);
          const outPutProgress = makeMyProgress(response.progress);
          console.log(outPutProgress, response);

          setProgress(outPutProgress);
          setcurrentQuestion(response.questions[0].id);
        })
        .catch((error) => {
          console.error("Error fetching exam:", error);
        })
        .finally(() => {
          setLoading(false); 
        });
    }
  }, [token, id]);

  // Function to update the exam object with new progress
  const handleProgressUpdate = (currentQuestion, updatedProgress) => {
    setProgress((prev) => ({
      ...prev,
      [currentQuestion.toString()]: updatedProgress,
    }));
    setExamObject((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [currentQuestion.toString()]: updatedProgress,
      },
    }));
  };

  return (
    <div className={`w-full flex flex-col items-start justify-center bg-white`}>
      <NavbarContainer />

      <div className={`w-full h-full  items-start justify-center`}>
        {loading ? (
          <div className="w-full p-6">
            <Skeleton height={50} width={200} />
            <div className="mt-4">
              <Skeleton height={20} count={3} />
            </div>
            <div className="mt-4">
              <Skeleton height={300} />
            </div>
          </div>
        ) : (
          examObject && (
            <QuestionWindow
              examJourneyId={id}
              length={length}
              questions={examObject.questions.find((qu) => {
                console.log(currentQuestion);

                return parseInt(qu.id) === parseInt(currentQuestion);
              })}
              questionId={currentQuestion}
              numbers={examObject.questions.map((qu) => parseInt(qu.id))}
              questionIndex={currentQuestion}
              nextIndex={
                examObject.questions[
                  examObject.questions.indexOf(
                    examObject.questions.find(
                      (q) => parseInt(q.id) === parseInt(currentQuestion)
                    )
                  ) + 1
                ]?.id
              }
              prevIndex={
                examObject.questions[
                  examObject.questions.indexOf(
                    examObject.questions.find(
                      (q) => parseInt(q.id) === parseInt(currentQuestion)
                    )
                  ) - 1
                ]?.id || examObject.questions[0].id
              }
              lastIndex={
                examObject.questions[examObject.questions.length - 1].id
              }
              type={examObject.type}
              progress={progress}
              setcurrentQuestion={setcurrentQuestion}
              reviewExam={reviewExam}
              setReviewExam={setReviewExam}
              time={
                examObject.time_left ? examObject.time_left.toString() : null
              }
              onCheck={(
                selectedAnswerAsText,
                selectedAnswerIndex,
                time_left
              ) => {
                updateExamJourney(token, id, {
                  time_left,
                  progress: {
                    ...examObject.progress,
                    [currentQuestion.toString()]: {
                      question_text: examObject.questions.find(
                        (qu) => parseInt(qu?.id) === parseInt(currentQuestion)
                      ).text,
                      answer: selectedAnswerIndex,
                      question_id: examObject.questions.find(
                        (qu) => parseInt(qu?.id) === parseInt(currentQuestion)
                      ).id,
                      is_correct: examObject.questions.find(
                        (qu) => parseInt(qu?.id) === parseInt(currentQuestion)
                      ).is_correct,
                    },
                  },
                  current_question_text: examObject.questions.find(
                    (qu) => parseInt(qu?.id) === parseInt(currentQuestion)
                  ).text,
                  current_question: parseInt(currentQuestion),
                })
                  .then((response) => {
                    console.log(response);
                    handleProgressUpdate(currentQuestion.toString(), {
                      question_text: examObject.questions.find(
                        (qu) => parseInt(qu.id) === parseInt(currentQuestion)
                      ).text,
                      answer: selectedAnswerIndex,
                      is_correct: response.is_correct,
                      // correct_answer:
                      //   response.progress[currentQuestion.toString()][
                      //     "correct_answer"
                      //   ],
                      is_disabled: true,
                    });
                    if (
                      Object.keys(response.progress).length < length &&
                      examObject?.type === "exam"
                    ) {
                      router.push(
                        `/quiz?id=${id}&q=${
                          examObject.questions[
                            examObject.questions.indexOf(
                              examObject.questions.find(
                                (qu) =>
                                  parseInt(qu.id) === parseInt(currentQuestion)
                              )
                            ) + 1
                          ].id
                        }`
                      );
                    }
                  })
                  .catch((error) => {
                    console.error("Error updating exam:", error);
                  });
              }}
            />
          )
        )}
      </div>
      <Footer />
    </div>
  );
};
export default Quiz;
