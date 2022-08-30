import axiosInstance from "@root/util/fetch";
import { useQuery } from "react-query";

import AccountLayout from "@components/Layout/AccountLayout";

import { AiOutlineDollar } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import { BsArrowRight, BsPersonCircle } from "react-icons/bs";
import Link from "next/link";

type StatusType = "success" | "fail" | "in_progress";

interface StatusBadgeProps {
  type: StatusType;
}
const StatusBadge = ({ type }: StatusBadgeProps) => {
  const statuses = {
    success: {
      bgClass: "bg-settings-success",
      message: "Zrealizowano pomyślnie",
    },
    fail: {
      bgClass: "bg-error-red",
      message: "Błąd wypłaty",
    },
    in_progress: {
      bgClass: "bg-waiting-yellow",
      message: "W oczekiwaniu na przelew",
    },
  };

  return (
    <div
      className={`rounded-md text-white py-1 px-4 w-fit ${statuses[type].bgClass}`}
    >
      {statuses[type].message}
    </div>
  );
};

const Funds = () => {
  const payouts = useQuery("payouts", () => axiosInstance.get("/payouts"));
  const user = useQuery("users-current", () =>
    axiosInstance.get("/users/current").then((res) => res.data.user)
  );
  const invited = useQuery("user-getInvitedUsers", () =>
    axiosInstance.get("/user/getInvitedUsers")
  );
  const payout = () => {
    axiosInstance
      .post("/payouts", { points: user?.data?.points })
      .then((res) => {})
      .catch((err) => {
        alert(`Wystąpił błąd podczas wypłaty: ${err.response.data.message}`);
      });
  };
  return (
    <AccountLayout section="funds">
      <h1 className="text-4xl font-medium">Moje środki</h1>
      <section className="kontener sm:kontener-rounded grid grid-cols-1 xl:grid-cols-2 gap-8 w-full p-4 lg:p-10">
        <div className="kontener-rounded flex flex-wrap items-center justify-between bg-hover-color2 py-5 px-10">
          <div className="text-xl flex flex-nowrap gap-3 items-center">
            <AiOutlineDollar className="text-3xl text-fiolet-quiz-answer" />
            {`${user?.data?.points} zł`}
          </div>
          <button
            type="button"
            onClick={payout}
            disabled={user?.data?.points == 0 ? true : false}
            className="disabled:opacity-50 flex flex-nowrap px-4 py-1 items-center border rounded-md border-green-quiz-answer text-green-quiz-answer"
          >
            Wypłać
            <BiChevronRight />
          </button>
        </div>
        <Link passHref href="/account/invited">
          <div className="cursor-pointer kontener-rounded flex flex-col justify-start flex-wrap bg-hover-color2 py-5 px-10">
            <BsPersonCircle className="text-3xl text-blue-quiz-answer" />
            <br />
            <div className="flex flex-nowrap justify-between items-center">
              <span>
                Liczba poleconych osób:{" "}
                <span className="font-bold">{invited?.data?.data?.count}</span>
              </span>
              <div className="justify-self-end">
                <BsArrowRight className="justify-self-end text-xl text-green-quiz-answer" />
              </div>
            </div>
          </div>
        </Link>
      </section>
      <div></div>
      <h1 className="text-3xl font-medium">Historia wypłat</h1>
      <section className="kontener sm:kontener-rounded sm:p-5">
        <table className="w-full table-auto">
          <tr className="bg-hover-color2">
            <td className="sm:rounded-l-2xl p-4">Data wypłaty</td>
            <td>Kwota</td>
            <td className="sm:rounded-r-2xl">Status</td>
          </tr>
          {payouts?.data?.data?.data?.map((payout: any) => (
            <tr
              key={payout.id}
              className="border-b border-platnosci-line-border"
            >
              <td className="p-6">
                {new Date(payout.created_at).toLocaleDateString("pl-PL")}
              </td>
              <td>{payout.amount} zł</td>
              <td>
                <StatusBadge type={payout.status} />
              </td>
            </tr>
          ))}
        </table>
      </section>
    </AccountLayout>
  );
};

export default Funds;
