import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { parseCookies } from "nookies";
import ScrollContainer from "react-indiana-drag-scroll";
import { useQuery } from "react-query";
import { useState } from "react";
import Layout from "@components/Layout";
import QuizCard from "@components/QuizCard";
import QuizCardSmall from "@components/QuizCardSmall";

import RectangleImage from "@public/Rectangle.svg";

import { FaCircle } from "react-icons/fa";
import { AiFillStar, AiFillHeart } from "react-icons/ai";
import { BsChevronRight } from "react-icons/bs";
import axiosInstance from "@root/util/fetch";
import Router from "next/router";
import { AccessModal } from "@components/Modals";

const Welcome = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const user = useQuery("users-current", () =>
    axiosInstance.get("/users/current").then((res) => res.data.user)
  );
  const plan = useQuery("user-getPlan", () =>
    axiosInstance.get("/user/getPlan").then((res) => res.data)
  );

  const handleClick = () => {
    if (!plan.data.data) {
      setIsOpen(true);
    } else {
      Router.push("/create-quiz");
    }
  };

  return (
    <div>
      {isOpen && <AccessModal onClose={() => setIsOpen(false)} />}

      <h2 className="text-4xl">
        Witaj {user.isFetched && user.data.name}!
        <br />
        Jaki quiz chcesz dzisiaj rozwiązać?
      </h2>
      <br />
      <Link passHref href="/quizzes">
        <div className="cursor-pointer text-icon-center text-reset text-decoration-none p-0 mb-2 whitespace-nowrap">
          <span className="align-middle inline-block">
            Zobacz wszystkie quizy
          </span>
          <BsChevronRight className="text-menu-hover ml-1 align-middle inline-block" />
        </div>
      </Link>
      <Link passHref href="/account/packets">
        <div className="cursor-pointer text-icon-center text-reset text-decoration-none p-0 whitespace-nowrap">
          <span className="align-middle inline-block">
            Zobacz dostępne pakiety
          </span>
          <BsChevronRight className="text-menu-hover ml-1 align-middle inline-block" />
        </div>
      </Link>
      <div className="h-28"></div>
      <div className="content-end my-10 flex flex-row flex-wrap gap-8">
        <div className="bg-white rounded-lg py-2 px-6 w-fit">
          <img
            className="align-middle inline-block w-5 h-5"
            src="/zaroweczka.png"
          />
          <span className="align-middle inline-block mx-4">Twoje punkty</span>
          {user.isFetched && (
            <div className="align-middle inline-block p-1 px-3 bg-sidebar-bg text-white rounded-lg w-fit text-sm">
              {user.data.points}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg py-2 px-6 w-fit">
          <img
            className="align-middle inline-block w-5 h-5"
            src="/diamencik_gold.png"
          />
          <span className="align-middle inline-block mx-4">Pakiet</span>
          {plan.isFetched && plan.data.name != undefined && (
            <div className="align-middle inline-block p-1 px-3 bg-sidebar-bg text-white rounded-lg w-fit text-sm">
              {plan.data.name}
            </div>
          )}
        </div>
        <div
          onClick={handleClick}
          className="cursor-pointer bg-white rounded-lg py-2 px-6 w-fit"
        >
          <span className="align-middle inline-block mx-4">
            Dodaj nowy quiz
          </span>
        </div>
      </div>
    </div>
  );
};

const InviteFriends = () => {
  const copyInviteCode = async () => {
    await axiosInstance.get("/user/getInvitationToken").then((res: any) => {
      const token = res.data.invitationToken;
      const invitationLink = new URL(`${window.location.host}/register`);
      invitationLink.searchParams.append("inv_token", token);
      navigator.clipboard.writeText(invitationLink.toString()).then(() => {
        alert("Skopiowano link");
      });
    });
  };
  return (
    <div className="grid grid-flow-row lg:grid-flow-col">
      <div
        className="max-w-2xl my-auto grow-0 shrink-0"
        style={{
          color: "#929292",
          paddingLeft: "4%",
        }}
      >
        <h1 className="text-black text-4xl my-4">
          Zaproś znajomych do wspólnej gry
        </h1>
        <br />
        <div className="text-lg leading-loose">
          Zaproś swoich znajomych do gry i oboje zyskajcie dodatkowe korzyści
          oraz super zabawę z rozwiązywania quizów i dodawania włąsnych.
          Wystarczym że skopiujesz poniższy kod z którego będzie mógł
          zarejestrować się Twój znajomy
        </div>
        <br />
        <button
          type="button"
          onClick={copyInviteCode}
          className="text-white rounded-lg bg-menu-hover p-4"
        >
          Skopiuj kod polecający
        </button>
      </div>

      <div className="w-xl my-auto grow hidden lg:block">
        <img src={"/people.svg"} alt="people" />
      </div>
    </div>
  );
};

const categoriesConfigs = [
  {
    class: "bg-blue-quiz-answer",
    figure: <Image src={RectangleImage} alt="rectangle" />,
  },
  {
    class: "bg-green-quiz-answer",
    figure: <AiFillStar color="green" className="text-7xl" />,
  },
  {
    class: "bg-red-quiz-answer",
    figure: <AiFillHeart color="#811331" className="text-7xl" />,
  },
  {
    class: "bg-fiolet-quiz-answer",
    figure: <FaCircle color="purple" className="text-6xl" />,
  },
];

const Home: NextPage = () => {
  const popularQuizzes = useQuery("quizzes-popular", () =>
    axiosInstance.get(`/quizzes/popular`)
  );
  const latestQuizzes = useQuery("quizzes-latest", () =>
    axiosInstance.get(`/quizzes/latest`)
  );
  const selectedQuizzes = useQuery("quizzes", () =>
    axiosInstance.get(`/quizzes`)
  );
  const categories = useQuery("categories", () =>
    axiosInstance.get(`/categories`)
  );
  const userPlan = useQuery("user/getPlan", () =>
    axiosInstance.get(`/user/getPlan`)
  );

  return (
    <Layout>
      <section className="p-5 lg:p-10 rounded-2xl bg-wreid-block">
        <Welcome />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-14">
        <div
          className="flex-1 rounded-2xl bg-white p-5 lg:p-10"
          style={{
            height: "32rem",
          }}
        >
          <h2 className="text-2xl mb-4">Nowe quizy</h2>
          <ScrollContainer className="space-y-3 lg:space-y-6 overflow-y-scroll hide-scrollbar h-96">
            {latestQuizzes?.data?.data.data.data.map((quiz: any) => (
              <div key={quiz.id}>
                <QuizCardSmall isStandard={!userPlan?.data?.data} quiz={quiz} />
              </div>
            ))}
          </ScrollContainer>
        </div>

        <div
          className="flex-1 rounded-2xl bg-white p-5 lg:p-10"
          style={{
            height: "32rem",
          }}
        >
          <h2 className="text-2xl mb-4">Popularne quizy</h2>
          <ScrollContainer className="space-y-3 lg:space-y-6 overflow-y-scroll hide-scrollbar h-96">
            {popularQuizzes?.data?.data.data.data.map((quiz: any) => (
              <div key={quiz.id}>
                <QuizCardSmall isStandard={!userPlan?.data?.data} quiz={quiz} />
              </div>
            ))}
          </ScrollContainer>
        </div>
      </section>

      <section className="rounded-2xl bg-white py-10 p-3 h-auto">
        <InviteFriends />
      </section>

      <div className="flex flex-wrap lg:flex-nowrap items-center gap-5 lg:gap-16 mt-5 lg:mt-20">
        <div className="font-black text-4xl">Kategorie</div>
        <ScrollContainer
          vertical={false}
          className="flex items-center w-auto gap-5"
        >
          {categories?.data?.data.data.map((category: any) => {
            const randomConfig =
              categoriesConfigs[
                Math.floor(Math.random() * categoriesConfigs.length)
              ];
            return (
              <Link passHref key={`category-${category.id}`} href={"/quizzes"}>
                <div
                  className={`${randomConfig.class} cursor-pointer flex flex-row items-center font-semibold text-3xl shrink-0 justify-center gap-4 flex-nowrap rounded-3xl w-72 h-24 px-5 text-white`}
                >
                  {randomConfig.figure}
                  <span>{category.name}</span>
                </div>
              </Link>
            );
          })}
        </ScrollContainer>
      </div>
      <div className="mb-5 lg:mb-20">
        <Link passHref href="/quizzes">
          <div className="cursor-pointer text-icon-center text-2xl text-right text-decoration-none whitespace-nowrap">
            <span className="align-middle inline-block">
              Zobacz wszystkie quizy
            </span>
            <BsChevronRight className="text-menu-hover ml-1 align-middle inline-block" />
          </div>
        </Link>
      </div>

      <section>
        <div>
          <div className="text-4xl font-bold">Wybrane dla Ciebie</div>
          <div
            className="text-xl my-5"
            style={{
              color: "#898989",
              maxWidth: "43rem",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna
          </div>
        </div>
        <ScrollContainer className="flex flex-row">
          {selectedQuizzes?.data?.data.data.data.map((quiz: any) => (
            <div className="shrink-0 mb-7 w-full md:w-auto" key={quiz.id}>
              <QuizCard isStandard={!userPlan?.data?.data} quiz={quiz} />
            </div>
          ))}
        </ScrollContainer>
      </section>
    </Layout>
  );
};

export default Home;
