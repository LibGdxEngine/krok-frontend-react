import Image from "next/image";
import unchecked from "../../../../public/tickcircleunchecked.svg";
import checked from "../../../../public/tickcircle.svg";

const QuestionItem = ({
  question,
  image,
  index,
  isSelected,
  onAnswer,
  answerState,
  is_disabled = false,
}) => {
  // console.log(
  //   question,
  //   image,
  //   index,
  //   isSelected,
  //   onAnswer,
  //   answerState,
  //   is_disabled
  // );
  
  const handleClick = () => {
    if (onAnswer) {
      onAnswer(index);
      let numOfAnswers = localStorage.getItem("numOfAnswers");
      if (!numOfAnswers || numOfAnswers === undefined) {
        localStorage.setItem("numOfAnswers", 1);
      } else {
        numOfAnswers = parseInt(numOfAnswers) + 1;
        localStorage.setItem("numOfAnswers", numOfAnswers);
      }
    }
  };
  const textStyle =
    answerState === "correct"
      ? "text-green-500"
      : answerState === "wrong"
      ? "text-red-500"
      : "text-black";

  return (
    <>
      <button
        onClick={handleClick}
        style={{ cursor: "pointer" }}
        className="w-full flex items-start rounded-2xl border border-white px-2 py-2 my-1"
        disabled={is_disabled}
      >
        <Image
          className="mx-2"
          src={isSelected ? checked : unchecked}
          alt=""
          width={25}
          height={25}
        />
        <div className={`font-bold ${textStyle}`}>{question}</div>
      </button>

      {image && (
        <div className="w-full flex items-start justify-center px-2 py-2 my-1">
          <Image className="mx-2" src={image} alt="" width={500} height={500} />
        </div>
      )}
    </>
  );
};

export default QuestionItem;
