import Image from "next/image";
import unchecked from "../../../../public/tickcircleunchecked.svg";
import checked from "../../../../public/tickcircle.svg";

const QuestionItem = ({
  question,
  index,
  isSelected,
  onAnswer,
  answerState,
}) => {
  const handleClick = () => {
    if (onAnswer) {
      onAnswer(index);
    }
  };
  const textStyle = answerState === "correct" ? "text-green-500" : answerState === "wrong" ? "text-red-500" : "text-black";

  return (
    <div
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      className="w-full flex items-start rounded-2xl border border-white px-2 py-2 my-1"
    >
      <Image
        className="mx-2"
        src={isSelected ? checked : unchecked}
        alt=""
        width={25}
        height={25}
      />
      <div className={`font-bold ${textStyle}`}>{question}</div>
    </div>
  );
};

export default QuestionItem;
