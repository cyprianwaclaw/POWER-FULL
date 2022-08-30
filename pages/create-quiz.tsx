import Layout from "@components/Layout";
import Router from "next/router";
import { Category } from "@root/types/api/api";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

type QuestionProps = {
  questionIndex: number;
};

type QuestionType = {
  index: number;
  name: string;
  answers: string[];
  validAnswerIndex: number;
};

const levels = [
  {
    label: "Łatwy",
    value: "easy",
  },
  {
    label: "Średni",
    value: "medium",
  },
  {
    label: "Trudny",
    value: "hard",
  },
];

const CreateQuiz = () => {
  const [categories, setCategories] = useState<Category[] | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [level, setLevel] = useState("wszystkie");
  const [time, setTime] = useState(15);
  const [image, setImage] = useState<File | null>(null);
  const [inputImage, setInputImage] = useState("/wgrajquiz.svg");
  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      index: 1,
      name: "",
      answers: [],
      validAnswerIndex: -1,
    },
  ]);
  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        index: questions.length + 1,
        name: "",
        answers: [],
        validAnswerIndex: -1,
      },
    ]);
  };
  const submitQuiz = () => {
    if (!title) {
      alert("Podaj tytuł quizu");
      return;
    }
    for (const question of questions) {
      if (!question.name) {
        alert("Podaj nazwę pytania");
        return;
      }
      if (question.validAnswerIndex === -1) {
        alert("Wybierz poprawną odpowiedź");
        return;
      }
    }
    const formData = new FormData();
    if (category) {
      formData.append("category_id", category.toString());
    }
    formData.append("title", title);
    formData.append("description", "");
    if (image) {
      formData.append("image", image);
    }
    formData.append("level", level);
    formData.append("time", time.toString());
    fetch(`${process.env.API_URL}/quizzes`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => data.data.id)
      .then((quizId) => {
        questions.forEach((question, index) => {
          fetch(`${process.env.API_URL}/questions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${parseCookies()["access_token"]}`,
            },
            body: JSON.stringify({
              question: question.name,
              quiz_id: quizId,
              category_id: category,
            }),
          })
            .then((res) => res.json())
            .then((data) => data.data.id)
            .then((questionId) => {
              question.answers.forEach((answer, index) => {
                let body: any = {
                  answer: answer,
                  question_id: questionId,
                };
                if (index === question.validAnswerIndex) {
                  body.correct = true;
                }
                fetch(`${process.env.API_URL}/answers`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${parseCookies()["access_token"]}`,
                  },
                  body: JSON.stringify(body),
                });
              });
            });
        });
        return quizId;
      })
      .then((quizId) => {
        Router.push(`/quiz/${quizId}`);
      });
  };
  function onCategoryChangeHandler(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const selectedOptions = event.currentTarget.selectedOptions[0];
    setCategory(parseInt(selectedOptions.value));
  }
  function onLevelChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOptions = event.currentTarget.selectedOptions[0];
    setLevel(selectedOptions.value);
  }
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  }

  useEffect(() => {
    fetch(`${process.env.API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data);
        setCategory(data.data[0].id);
      });
  }, []);

  const Question = ({ questionIndex }: QuestionProps) => {
    const [name, setName] = useState("Przykładowe pytanie");
    const [quest1, setQuest1] = useState("Odpowiedź pierwsza");
    const [quest2, setQuest2] = useState("Odpowiedź druga");
    const [quest3, setQuest3] = useState("Odpowiedź trzecia");
    const [quest4, setQuest4] = useState("Odpowiedź czwarta");

    useEffect(() => {
      const queb = questions;
      queb[questionIndex].name = name;
      queb[questionIndex].answers = [quest1, quest2, quest3, quest4];
      setQuestions(queb);
    }, [questionIndex, quest1, quest2, quest3, quest4, name]);

    const setAnswer = (answerIndex: number) => {
      const queb = questions;
      queb[questionIndex].validAnswerIndex = answerIndex - 1;
      setQuestions(queb);
    };

    return (
      <div className="grid w-full">
        <span className="m-2 text-xl">
          Pytanie {questions[questionIndex].index}:
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-[42rem] min-w-0 h-10 mx-2 mt-2 p-3 mb-8 bg-input-bg border border-border-filter rounded-xl"
        />
        <span className="max-w-[42rem] min-w-0 flex flex-nowrap place-items-center">
          <input
            type="radio"
            value="1"
            name={`answer-${questionIndex}`}
            onChange={(e) => setAnswer(parseInt(e.target.value))}
          />
          <input
            type="text"
            value={quest1}
            onChange={(e) => setQuest1(e.target.value)}
            className="min-w-0 m-2 mx-4 p-4 text-left bg-blue-quiz-answer rounded-xl text-white text-xl font-medium"
          />
        </span>
        <span className="max-w-[42rem] min-w-0 flex flex-nowrap place-items-center">
          <input
            type="radio"
            value="2"
            name={`answer-${questionIndex}`}
            onChange={(e) => setAnswer(parseInt(e.target.value))}
          />
          <input
            type="text"
            value={quest2}
            onChange={(e) => setQuest2(e.target.value)}
            className="min-w-0 m-2 mx-4 p-4 text-left bg-fiolet-quiz-answer rounded-xl text-white text-xl font-medium"
          />
        </span>
        <span className="max-w-[42rem] min-w-0 flex flex-nowrap place-items-center">
          <input
            type="radio"
            value="3"
            name={`answer-${questionIndex}`}
            onChange={(e) => setAnswer(parseInt(e.target.value))}
          />
          <input
            type="text"
            value={quest3}
            onChange={(e) => setQuest3(e.target.value)}
            className="min-w-0 m-2 mx-4 p-4 text-left bg-red-quiz-answer rounded-xl text-white text-xl font-medium"
          />
        </span>
        <span className="max-w-[42rem] min-w-0 flex flex-nowrap place-items-center">
          <input
            type="radio"
            value="4"
            name={`answer-${questionIndex}`}
            onChange={(e) => setAnswer(parseInt(e.target.value))}
          />
          <input
            type="text"
            value={quest4}
            onChange={(e) => setQuest4(e.target.value)}
            className="min-w-0 m-2 mx-4 p-4 text-left bg-green-quiz-answer rounded-xl text-white text-xl font-medium"
          />
        </span>
      </div>
    );
  };

  return (
    <Layout>
      <section className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-xl p-4 lg:p-10">
        <div className="cols-span-1 lg:col-span-2 ml-10">
          <h1 className="text-4xl">Nowy quiz</h1>
        </div>
        <div className="p-4 lg:p-10 rounded-2xl space-x-10 text-xl">
          <div className="grid grid-flow-row gap-10">
            <div className="flex flex-wrap lg:flex-nowrap">
              <span>Nazwa quizu:</span>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-input-bg border border-border-filter rounded-lg resize-none"
                rows={4}
              ></textarea>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap">
              <span>Kategoria:</span>
              <select
                name="category"
                onChange={onCategoryChangeHandler}
                className="h-10 w-full mx-2 bg-input-bg border border-border-filter rounded-lg"
              >
                {categories &&
                  categories.map((cat, index) => (
                    <option key={`category-select-${index}`} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap">
              <span className="break-normal">Poziom trudności:</span>
              <select
                name="level"
                onChange={onLevelChangeHandler}
                className="h-10 w-full mx-2 bg-input-bg border border-border-filter rounded-lg"
              >
                {levels.map((level, index) => (
                  <option key={`level-${level.label}`} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center lg:flex-nowrap">
              Czas trwania:
              <span className="flex flex-nowrap">
                <input
                  min={1}
                  defaultValue={15}
                  value={time}
                  onChange={(e) => setTime(parseInt(e.target.value))}
                  className="show-spin w-16 mx-2 bg-input-bg border border-border-filter rounded-lg p-2"
                  type="number"
                />
              </span>
              minut
            </div>
          </div>
        </div>
        <div className="cursor-pointer">
          <label htmlFor="file-input">
            {/* <img src="/wgrajquiz.svg" alt="upload image placeholder" /> */}
            <input
              type="file"
              id="upload_img"
              name="upload_img"
              onChange={handleImageChange}
              accept=".jpg, .jpeg, .png"
              style={{
                background: `url('${inputImage}') center center no-repeat`,
              }}
            />

            {/* <Image src={quizImage} layout="fill" alt="quizImage" /> */}
          </label>
        </div>
      </section>

      {/* <div className="mx-auto my-14 lg:w-3/4 sm:w-full grid grid-cols-1 gap-14 bg-white rounded-xl p-10"> */}
      <section className="grid max-w-full bg-white p-4 lg:p-10 rounded-xl">
        <div className="grid gap-5">
          {questions.map((question, index) => (
            <Question questionIndex={index} key={index} />
          ))}
        </div>
        <button
          type="button"
          onClick={addNewQuestion}
          className="m-2 p-3 px-16 justify-self-end bg-white border-blue-300 border-2 rounded-xl text-blue-300"
        >
          Dodaj Nowe Pytanie
        </button>
      </section>

      <button
        type="button"
        onClick={submitQuiz}
        className="md:m-2 p-3 w-full md:w-auto md:px-10 justify-self-start bg-menu-hover text-white rounded-xl"
      >
        Utwórz nowy quiz
      </button>
    </Layout>
  );
};
export default CreateQuiz;
