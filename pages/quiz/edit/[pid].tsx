import Layout from "@components/Layout";
import Router, { useRouter } from "next/router";
import { Category } from "@root/types/api/api";
import { parseCookies } from "nookies";
import { useEffect, useReducer, useRef, useState } from "react";
import axiosInstance from "@root/util/fetch";

type QuestionProps = {
  questionIndex: number;
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

const EditQuiz = () => {
  const router = useRouter();
  const { pid } = router.query;

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<number | null>(null);
  const [level, setLevel] = useState("wszystkie");
  const [time, setTime] = useState(15);
  const [image, setImage] = useState<File | null>(null);
  const [inputImage, setInputImage] = useState("/wgrajquiz.svg");
  const [questions, setQuestions] = useState<
    Array<{
      name: string;
      answers: string[];
      validAnswerIndex: number;
    }>
  >([
    {
      name: "",
      answers: [],
      validAnswerIndex: 0,
    },
  ]);

  useEffect(() => {
    axiosInstance.get(`/quizzes/${pid}`).then((res) => {
      setCategory(res.data.data.category_id);
      setTitle(res.data.data.title);
      setInputImage(res.data.data.image);
      setLevel(res.data.data.difficulty);
    });
    axiosInstance.get(`/quizzes/${pid}/questions`).then((res) => {
      setQuestions(res.data.data);
    });
  }, [pid]);

  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        name: "",
        answers: [],
        validAnswerIndex: 0,
      },
    ]);
  };
  const submitQuiz = () => {
    if (!title) {
      alert("Podaj tytuł quizu");
      return;
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
    // formData.append("level", level);
    // formData.append("time", time.toString());
    fetch(`${process.env.API_URL}/quizzes/${pid}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        questions.forEach((question: any, index: number) => {
          let url = `/questions`;
          let method = "POST";
          let body: any = {
            question: question.name,
            category_id: category,
          };
          if (question.id) {
            url = `/questions/${question.id}`;
            method = "PATCH";
            body.quiz_id = pid;
          }
          axiosInstance(url, {
            method: method,
            params: body,
          })
            .then((data) => data.data.id)
            .then((questionId) => {
              question.answers.forEach((answer: any, index: number) => {
                let url = `/answers`;
                let method = "POST";
                let body: any = {
                  answer: answer,
                  question_id: questionId,
                };
                if (answer.id) {
                  url = `/answers/${answer.id}`;
                  method = "PATCH";
                }
                axiosInstance(url, {
                  method: method,
                  params: body,
                });
              });
            })
            .then(() => {
              alert("Pomyślnie zaktualizowano quiz");
              Router.push(`/account/quizzes`);
            });
        });
      });
  };
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
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
      setInputImage("/wgrajquiz.svg");
      setImage(event.target.files[0]);
    }
  }
  const getImage = () => {
    if (hiddenFileInput && hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };
  const handleImageRemove = () => {
    setInputImage("/wgrajquiz.svg");
    setImage(null);
  };

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

  const Question = ({
    questionIndex,
    question,
  }: {
    questionIndex: number;
    question: {
      answers: Array<string>;
      created_at: string;
      id: number;
      question: string;
      quiz_id: number;
      updated_at: string;
    };
  }) => {
    const [name, setName] = useState(question.question);

    const [quests, setQuests] = useReducer(
      (state: string[], newState: { index: number; value: string }) => {
        state[newState.index] = newState.value;
        return state;
      },
      question.answers
    );

    useEffect(() => {
      const queb = questions;
      queb[questionIndex].name = name;
      queb[questionIndex].answers = quests;
      setQuestions(queb);
    }, [questionIndex, quests, name]);

    if (!quests || quests.length < 1) {
      return <></>;
    }

    return (
      <div className="grid w-full">
        <span className="m-2 text-xl">Pytanie {questionIndex + 1}:</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-[42rem] min-w-0 h-10 mx-2 mt-2 p-3 mb-8 bg-input-bg border border-border-filter rounded-xl"
        />
        <span className="max-w-[42rem] min-w-0 flex flex-nowrap place-items-center">
          <input type={"checkbox"} />
          <input
            type="text"
            value={quests[0]}
            onChange={(e) => setQuests({ index: 0, value: e.target.value })}
            className="min-w-0 m-2 mx-4 p-4 text-left bg-blue-quiz-answer rounded-xl text-white text-xl font-medium"
          />
        </span>
        <span className="max-w-[42rem] min-w-0 flex flex-nowrap place-items-center">
          <input type={"checkbox"} />
          <input
            type="text"
            value={quests[1]}
            onChange={(e) => setQuests({ index: 1, value: e.target.value })}
            className="min-w-0 m-2 mx-4 p-4 text-left bg-fiolet-quiz-answer rounded-xl text-white text-xl font-medium"
          />
        </span>
        <span className="max-w-[42rem] min-w-0 flex flex-nowrap place-items-center">
          <input type={"checkbox"} />
          <input
            type="text"
            value={quests[2]}
            onChange={(e) => setQuests({ index: 2, value: e.target.value })}
            className="min-w-0 m-2 mx-4 p-4 text-left bg-red-quiz-answer rounded-xl text-white text-xl font-medium"
          />
        </span>
        <span className="max-w-[42rem] min-w-0 flex flex-nowrap place-items-center">
          <input type={"checkbox"} />
          <input
            type="text"
            value={quests[3]}
            onChange={(e) => setQuests({ index: 3, value: e.target.value })}
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
          <h1 className="text-4xl">Edycja quizu</h1>
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
                {levels.map((lev, index) => (
                  <option
                    key={`level-${lev.label}`}
                    value={lev.value}
                    selected={lev.value == level ? true : false}
                  >
                    {lev.label}
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
        <div className="flex flex-col gap-8">
          <div className="rounded-2xl flex ">
            <img src={inputImage} className="object-cover h-[23rem] w-full" />
          </div>
          <div className="flex w-full flex-row gap-8 h-14">
            <div
              className="w-1/2 grow-0 cursor-pointer flex p-3 px-6 bg-blue-quiz-answer rounded-2xl"
              onClick={getImage}
            >
              <input
                type={"file"}
                onChange={handleImageChange}
                ref={hiddenFileInput}
                style={{ display: "none" }}
              />
              <span className="self-center text-white">Zmień zdjęcie</span>
            </div>
            <div
              className="w-1/2 grow-0 cursor-pointer flex p-3 px-6 bg-red-quiz-answer rounded-2xl"
              onClick={handleImageRemove}
            >
              <span className="self-center text-white">Usuń zdjęcie</span>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="mx-auto my-14 lg:w-3/4 sm:w-full grid grid-cols-1 gap-14 bg-white rounded-xl p-10"> */}
      <section className="grid max-w-full bg-white p-4 lg:p-10 rounded-xl">
        <div className="grid gap-5">
          {questions.map((question: any, index: number) => (
            <Question questionIndex={index} question={question} key={index} />
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
        Zapisz quiz
      </button>
    </Layout>
  );
};
export default EditQuiz;
