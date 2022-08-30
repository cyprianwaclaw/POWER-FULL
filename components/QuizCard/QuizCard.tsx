import { BsClock } from "react-icons/bs";
import { HiOutlineAcademicCap, HiOutlineLightBulb } from "react-icons/hi";
import { useState } from "react";
import { AccessModal } from "@components/Modals";

const difficulties = new Map([
  ["easy", { text: "Łatwy" }],
  ["medium", { text: "Średni" }],
  ["hard", { text: "Trudny" }],
]);

interface Props {
  quiz?: any;
  isStandard?: boolean;
}

export const QuizCard = ({ quiz, isStandard }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (isStandard) {
      setIsOpen(true);
    } else {
      // TODO here we should put functionality when we have Premium account
    }
  };
  return (
    <>
      {isOpen && <AccessModal onClose={() => setIsOpen(false)} />}
      <div
        onClick={handleClick}
        className="cursor-pointer rounded-3xl max-w-96 bg-white shadow-xl m-3 mb-0 lg:m-5 lg:mb-10"
      >
        <div className="h-60">
          <img
            src={quiz.image}
            className="rounded-3xl object-cover"
            style={{
              width: "27.75rem",
              height: "100%",
            }}
            // layout="fill"
            alt="eagle"
          />
        </div>
        <div className="p-5">
          <span className="font-semibold text-lg">{quiz.title}</span>
          <div className="flex gap-4">
            <span className="">
              <BsClock className="text-blue-quiz-answer align-middle inline-block m-2 text-xl" />
              <span className="text-small align-middle inline-block">{`${quiz.time} min`}</span>
            </span>
            <span className="text-icon-center">
              <HiOutlineLightBulb className="text-fuchsia-600 align-middle inline-block m-2 text-xl" />
              <span className="text-small align-middle inline-block">
                {`${quiz.questions_count} pytań`}
              </span>
            </span>
            <span className="text-icon-center">
              <HiOutlineAcademicCap className="text-green-600 align-middle inline-block m-2 text-xl" />
              <span className="text-small align-middle inline-block">
                {difficulties.get(quiz.difficulty)?.text ?? quiz.difficulty}
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
