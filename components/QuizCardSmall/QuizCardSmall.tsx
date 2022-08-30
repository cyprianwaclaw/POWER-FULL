import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { AccessModal } from "@components/Modals";

interface Props {
  quiz?: any;
  isStandard?: boolean;
}

export const QuizCardSmall = ({ quiz, isStandard }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (isStandard) {
      setIsOpen(true);
    } else {
      Router.push(`/quiz/${quiz.id}`);
    }
  };

  if (!quiz) {
    quiz = quiz ?? "";
    return (
      <Link passHref href={quiz}>
        <div className="cursor-pointer flex flex-row items-center bg-background p-6 gap-6 rounded-xl">
          <div className="bg-another-wreid rounded-xl w-28 h-24 hidden md:block"></div>
          <div className="flex flex-col content-center gap-5">
            <h3 className="text-lg">
              Jaką związaną z naturą osobowość posiadasz?
            </h3>
            <span className="text-small">
              Czas trwania: 5 min | Liczba pytań: 15
            </span>
          </div>
        </div>
      </Link>
    );
  }
  return (
    <>
      {isOpen && <AccessModal onClose={() => setIsOpen(false)} />}
      <div
        onClick={handleClick}
        className="cursor-pointer flex flex-row items-center bg-background p-6 gap-6 rounded-xl"
      >
        {quiz.image ? (
          <img
            src={quiz.image}
            alt="quiz image social"
            className="w-28 h-24 rounded-xl hidden md:block"
          />
        ) : (
          <div className="bg-another-wreid rounded-xl w-28 h-24 hidden md:block"></div>
        )}
        <div className="flex flex-col content-center gap-5">
          <h3 className="text-lg">{quiz.title}</h3>
          <span className="text-small">
            Czas trwania: {quiz.time} min | Liczba pytań: {quiz.questions_count}
          </span>
        </div>
      </div>
    </>
  );
};
