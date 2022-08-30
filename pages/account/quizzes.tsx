import AccountLayout from "@components/Layout/AccountLayout";
import axiosInstance from "@root/util/fetch";
import Link from "next/link";
import { useQuery } from "react-query";

const QuizMediumCard = ({ quiz }: { quiz: any }) => {
  const deleteCurrentQuiz = () => {
    axiosInstance
      .delete(`/quizzes/${quiz.id}`)
      .then((res) => {
        alert("Successfuly deleted quiz");

      })
      .catch((error) => {
        alert("There was an error: " + error);
      });
  };
  return (
    <div
      className="kontener sm:kontener-rounded relative overflow-hidden bg-no-repeat bg-cover max-w-xs"
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
    >
      <div className="cursor-pointer sm:max-w-xs w-[20rem] h-[25rem] sm:h-[20rem] p-5 flex flex-col">
        <div className="shrink-0 h-[10.375rem]">
          <img
            src={quiz.image}
            alt="quiz image"
            className="object-cover rounded-xl h-[10.375rem]"
            width={278}
            height={166}
          />
        </div>
        <div className="text-xl py-2 leading-relaxed">{quiz.title}</div>
      </div>
      <div
        className="flex flex-row justify-center items-center gap-5 absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed opacity-0 hover:opacity-100 transition duration-300 ease-in-out"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      >
        <span className="cursor-pointer h-20 w-20">
          <img
            src="/delete.png"
            alt="delete"
            width={100}
            height={100}
            onClick={deleteCurrentQuiz}
          />
        </span>
        <span className="cursor-pointer h-20 w-20">
          <Link passHref href={`/quiz/edit/${quiz.id}`}>
            <img src="/edit.png" alt="edit" />
          </Link>
        </span>
      </div>
    </div>
  );
};

const Quizzes = () => {
  const userQuizzes = useQuery("user-quizzes", () =>
    axiosInstance.get("/user/quizzes")
  );
  return (
    <AccountLayout section="quizzes">
      <h1 className="text-4xl">Moje quizy</h1>
      <div className="flex flex-wrap min-h-[40rem] lg:justify-start justify-center gap-6">
        {userQuizzes?.data?.data?.data?.map((quiz: any) => (
          <div key={quiz.id}>
            <QuizMediumCard quiz={quiz} />
          </div>
        ))}
        <Link passHref href={`/invite-friends`}>
          <div className="cursor-pointer kontener sm:kontener-rounded sm:max-w-xs sm:w-[20rem] h-[25rem] sm:h-[20rem] p-5 flex flex-col">
            <br />
            <br />
            <br />
            <div className="text-4xl font-bold text-center my-auto">
              Zaproś znajomych
            </div>
          </div>
        </Link>
      </div>
    </AccountLayout>
  );
};

export default Quizzes;
