import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AccessModal } from "@components/Modals";

import axiosInstance from "@root/util/fetch";

import Layout from "@components/Layout";
import QuizCard from "@components/QuizCard";

import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { QuizzesQuiz } from "@root/types/api/api";
import { useQuery } from "react-query";
import { useForm } from "react-hook-form";
import { URL } from "url";

const difficulties = [
  {
    label: "Wszystkie",
    value: "",
  },
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

type FormData = {
  search?: string;
  questionsQuantity?: number;
  difficulty?: string;
  time?: number;
  category?: string;
};

const convertToParams = ({
  search,
  questionsQuantity,
  difficulty,
  time,
  category,
}: FormData): string => {
  const params = new URLSearchParams();
  if (search) params.append("s", search);
  if (questionsQuantity) params.append("q", questionsQuantity.toString());
  if (difficulty) params.append("d", difficulty);
  if (time) params.append("t", time.toString());
  if (category) params.append("c", category);
  return params.toString();
};

const Quizy: NextPage = () => {
  const router = useRouter();
  const { page, s, q, d, t, c } = router.query;
  const [pageIndex, setPageIndex] = useState(
    page ? parseInt(page as string) : 1
  );
  const [isOpen, setIsOpen] = useState(false);
  const plan = useQuery("user-getPlan", () =>
    axiosInstance.get("/user/getPlan").then((res) => res.data)
  );
  useEffect(() => {
    const query = router.query;
    const params = convertToParams({
      search: query.s as string,
      questionsQuantity: parseInt(query.q as string),
      difficulty: query.d as string,
      time: parseInt(query.t as string),
      category: query.c as string,
    });
    if (!plan?.data?.data) {
      setIsOpen(true);
    } else {
      router.push(`/quizzes/${pageIndex}${params ? "?" + params : ""}`);
    }
  }, [pageIndex]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleFilterSubmit = (data: FormData) => {
    const params = convertToParams({
      search: data.search,
      questionsQuantity: data.questionsQuantity,
      difficulty: data.difficulty,
      time: data.time,
      category: data.category,
    });
    router.push(`/quizzes/${pageIndex}${params ? "?" + params : ""}`);
  };

  const quizzes = useQuery(`quizzes-page-${pageIndex}-${d}-${t}`, () =>
    axiosInstance
      .get(`/quizzes`, {
        params: {
          page: pageIndex,
          difficulty: d,
          time: t,
        },
      })
      .then((res) => res.data.data)
  );

  const categories = useQuery("categories", () =>
    axiosInstance.get("/categories").then((res) => res)
  );

  return (
    <Layout withGrid={false}>
      {isOpen && (
        <AccessModal
          onClose={() => {
            router.push(`/`);
            setIsOpen(false);
          }}
        />
      )}
      <div
        className="mx-auto my-3 lg:my-14 grid grid-cols-1 gap-3 lg:gap-14"
        style={{ maxWidth: "96rem" }}
      >
        <section className="rounded-2xl bg-white shadow-xl p-5 lg:p-10 mx-3 lg:mx-28">
          <form
            onSubmit={handleSubmit(handleFilterSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-16"
          >
            <h1 className="font-semibold text-4xl">Znajdź idealny quiz</h1>

            <div className="lg:col-span-2 lg:justify-self-end flex">
              <div
                style={{
                  marginLeft: "58px",
                  width: "33.3125rem",
                }}
              >
                <input
                  type="text"
                  className="border-border-filter block p-1.5 pl-4 w-full text-gray-900 rounded-5 border-2 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Wyszukaj quiz..."
                  style={{
                    backgroundColor: "#F9F9F9",
                  }}
                  {...register("search", {
                    value: typeof s === "string" ? s : "",
                  })}
                />
              </div>
            </div>

            <div className="flex flex-row flex-nowrap">
              <label htmlFor="questionsQuantity" className="text-xl m-2">
                Liczba pytań:
              </label>
              <input
                type="number"
                className="border-2 border-border-filter rounded-xl w-24 h-11 p-2"
                style={{ backgroundColor: "#F9F9F9" }}
                {...register("questionsQuantity", {
                  value: q ? parseInt(q as string) : undefined,
                })}
              />
            </div>

            <div className="flex flex-row flex-nowrap">
              <label htmlFor="time" className="text-xl m-2">
                Czas trwania:
              </label>
              <input
                type="number"
                className="border-2 border-border-filter rounded-xl w-24 h-11 p-2"
                style={{ backgroundColor: "#F9F9F9" }}
                {...register("time", {
                  value: t ? parseInt(t as string) : undefined,
                })}
              />
            </div>

            <div className="flex flex-row flex-wrap">
              <label htmlFor="category" className="text-xl m-2">
                Kategoria:
              </label>
              <select
                className="border-2 border-border-filter rounded-xl w-64 p-2"
                style={{ backgroundColor: "#F9F9F9" }}
                {...register("category", {})}
                defaultValue={c ? c : ""}
              >
                <option value="wszystkie">Wszystkie</option>
                {!categories.isLoading &&
                  categories.data &&
                  categories.data.data.data.map(
                    (category: any, index: number) => (
                      <option key={`category-${index}`} value={category.id}>
                        {category.name}
                      </option>
                    )
                  )}
              </select>
            </div>

            <div className="lg:col-span-2 flex flex-row flex-wrap">
              <label htmlFor="difficulty" className="shrink-0 text-xl m-2">
                Poziom trudności:
              </label>
              <select
                className="shrink-0 border-2 border-border-filter rounded-xl w-64 p-2"
                style={{ backgroundColor: "#F9F9F9" }}
                {...register("difficulty", {})}
              >
                {difficulties.map((diff: any) => (
                  <option
                    key={diff.value}
                    selected={diff.value == d}
                    value={diff.value}
                  >
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="justify-self-end">
              <button
                type="submit"
                className="text-white bg-menu-hover py-3 px-7 rounded-lg"
              >
                Filtruj
              </button>
            </div>
          </form>
        </section>

        <div className="justify-self-end flex flex-wrap justify-center items-center">
          <span className="tracking-wide mt-3 lg:mt-0">
            Sortowanie wyników:
          </span>
          <select
            name="sortowanie"
            className="border-2 border-border-filter rounded-xl w-64 p-2 m-2 uppercase"
            style={{ backgroundColor: "#F9F9F9" }}
          >
            <option value="najpopularniejsze">Najpopularniejsze</option>
            <option value="najnowsze">Najnowsze</option>
          </select>
        </div>

        <section className="justify-self-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center justify-center">
          {quizzes.isLoading ? (
            <p>Ładowanie...</p>
          ) : quizzes.data.lenght < 1 ? (
            <p>Nie znaleziono żadnych quizów</p>
          ) : (
            <>
              {quizzes.data.data.map((quiz: QuizzesQuiz) => (
                <Link
                  passHref
                  href={`/quiz/${quiz.id}`}
                  key={`quiz-${quiz.id}`}
                >
                  <div className="justify-self-center">
                    <QuizCard quiz={quiz} />
                  </div>
                </Link>
              ))}
            </>
          )}
        </section>
        <div className="flex flex-wrap gap-5 justify-items-center justify-between">
          {quizzes?.data?.prev_page_url ? (
            <div
              onClick={() => {
                setPageIndex(pageIndex - 1);
              }}
              className="cursor-pointer underline underline-offset-4 text-2xl p-0 whitespace-nowrap"
            >
              <BsChevronLeft className="text-menu-hover ml-1 align-middle inline-block" />
              <span className="underline underline-offset-4 align-middle inline-block">
                Poprzednia strona
              </span>
            </div>
          ) : (
            <div className="invisible"></div>
          )}
          {quizzes?.data?.next_page_url ? (
            <div
              onClick={() => {
                setPageIndex(pageIndex + 1);
              }}
              className="justify-self-end cursor-pointer underline underline-offset-4 text-2xl p-0 whitespace-nowrap"
            >
              <span className="underline underline-offset-4 align-middle inline-block">
                Następna strona
              </span>
              <BsChevronRight className="text-menu-hover ml-1 align-middle inline-block" />
            </div>
          ) : (
            <div className="invisible"></div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Quizy;
