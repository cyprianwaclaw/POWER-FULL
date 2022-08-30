import { useRouter } from "next/router";
import Image from "next/image";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import Modal from "react-modal";
import {
  Quiz,
  QuizData,
  QuizStart,
  QuizStartData,
  Question,
  QuestionsData,
} from "@root/types/api/api";

import Layout from "@components/Layout";
import QuizCardSmall from "@components/QuizCardSmall";

import QuizImage from "@public/QuizImage.svg";
import Positive from "@public/positive.svg";
import Negative from "@public/negative.svg";

type QuestionProps = {
  quizStart: QuizStart;
};

const QuizPage = () => {
  const router = useRouter();
  const { pid } = router.query;

  const [szybkaDwojka, setSzybkaDwojka] = useState(null);

  const [index, setIndex] = useState(0);
  const [quizStart, setQuizStart] = useState<QuizStart>();
  const [questions, setQuestions] = useState<Question[]>();
  const [quiz, setQuiz] = useState<Quiz>();
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const [exception, setException] = useState<string | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    fetch(`${process.env.API_URL}/quizzes/popular`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSzybkaDwojka(data.data.data);
      });
  }, []);

  useEffect(() => {
    if (!pid) {
      return;
    }
    fetch(`${process.env.API_URL}/quizzes/${pid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
    })
      .then((res) => res.json())
      .then((data: QuizData) => {
        setQuiz(data.data);
      });
    fetch(`${process.env.API_URL}/quizzes/${pid}/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
    })
      .then((res) => res.json())
      .then((data: QuestionsData) => {
        if (data.data.length === 0) {
          setException("Nie ma pytań dla tego quizu");
          return;
        }
        setQuestions(data.data);
      });
    fetch(`${process.env.API_URL}/quiz/${pid}/start`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
    })
      .then((res) => res.json())
      .then((data: QuizStartData) => {
        setQuizStart(data.data);
      });
  }, [pid]);

  const Question = ({ quizStart }: QuestionProps) => {
    const { submission_id, next_question } = quizStart;
    const { id, question, answers } = next_question;
    const selectAnswer = (answer_id: string) => {
      fetch(
        `${process.env.API_URL}/quiz/submission/${submission_id}/answerQuestion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${parseCookies()["access_token"]}`,
          },
          body: JSON.stringify({
            question_id: id,
            answer_id: answer_id,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            if (data.data.is_correct != undefined) {
              setResult(data.data.is_correct == "1" ? true : false);
              setIsOpen(true);
            }
            setQuizStart(data.data);
          }
        });

      if (questions) {
        if (index + 1 < questions.length) {
          setIndex(index + 1);
        } else {
          setFinished(true);
        }
      }
    };

    const colors = ["blue", "fiolet", "red", "green"];
    return (
      <div>
        <div className="text-center mb-5">
          <span className="text-xl text-neutral-500">Pytanie {index + 1}</span>
          <br />
          <span className="text-3xl font-medium">{question}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 lg:m-10">
          {answers.map((answer, i) => (
            <button
              key={`answer-${i}`}
              value={answer?.id}
              onClick={(e) =>
                selectAnswer((e.target as HTMLButtonElement).value)
              }
              disabled={!answer}
              className={`cursor-pointer rounded-2xl p-10 text-2xl text-white bg-${colors[i]}-quiz-answer focus:ring-4 focus:ring-gray-300`}
            >
              {answer?.answer}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <section className="shadow-lg bg-white rounded-2xl p-4 lg:p-14 pb-4">
        <div className="text-center text-base text-neutral-400 mb-5">
          {quiz && quiz.title}
        </div>
        {exception ? (
          <div className="text-center text-base text-neutral-400 mb-5">
            {exception}
          </div>
            ) : !finished ? (
          quizStart && <Question quizStart={quizStart} />
        ) : (
          <div className="text-center">Koniec</div>
        )}
      </section>
      {szybkaDwojka && (
        <section className="shadow-lg bg-white rounded-2xl">
          <div className="text-3xl font-medium mx-7 mt-7 lg:mx-14 lg:mt-14 mb-0">
            Szybka dwójka
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-10">
            <div className="m-7 lg:m-14 space-y-6">
              <QuizCardSmall quiz={szybkaDwojka[0]} />
              <QuizCardSmall quiz={szybkaDwojka[1]} />
            </div>
            <div className="self-end hidden xl:block">
              <Image src={QuizImage} alt="quiz image social" />
            </div>
          </div>
        </section>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="modal"
        ariaHideApp={false}
        className={`grid place-content-center content-center h-screen modal`}
      >
        <div
          className={`grid grid-flow-row gap-8 justify-items-center content-center text-center rounded-3xl w-[50rem] h-[38rem] ${
            result
              ? "bg-positive-bg text-positive"
              : "bg-negative-bg text-negative"
          }`}
        >
          <Image
            src={result ? Positive : Negative}
            height="120"
            width="120"
            alt="result icon"
          />
          <h2 className="text-3xl font-bold mt-6">
            {result ? "Poprawna odpowiedź" : "Błędna odpowiedź"}
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="py-2 px-10 rounded-lg"
            style={{ border: "1px solid" }}
          >
            OK
          </button>
        </div>
      </Modal>
    </Layout>
  );
};

export default QuizPage;
