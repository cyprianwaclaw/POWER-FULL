import AccountLayout from "@components/Layout/AccountLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import Router from "next/router";
import { AccessModal } from "@components/Modals";

import {
  UserInvitedUsers,
  UserPlan,
  User,
  UserData,
  UserInvitedUsersData,
} from "@root/types/api/api";

import { IconType } from "react-icons";
import { AiOutlineDollar, AiOutlinePlusCircle } from "react-icons/ai";
import { BsArrowRight, BsDice5 } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { HiOutlineCreditCard, HiOutlineLightBulb } from "react-icons/hi";
import { GrDiamond } from "react-icons/gr";
import { useQuery } from "react-query";
import axiosInstance from "@root/util/fetch";

interface BlockyButtonProps {
  Icon: IconType;
  bgColor: string;
  iconColor: string;
  text: string;
  href: string;
}
const BlockyButton = ({
  Icon,
  bgColor,
  iconColor,
  text,
  href,
}: BlockyButtonProps) => {
  return (
    <Link passHref href={href}>
      <div
        className={`kontener-rounded flex flex-row items-center justify-between gap-4 cursor-pointer bg-blocky-purple py-8 px-10`}
      >
        <div className="flex flex-nowrap gap-4 justify-between items-center">
          <Icon className={`text-4xl text-${iconColor}`} />
          <span>{text}</span>
        </div>
        <BsArrowRight className="justify-self-end text-xl text-green-quiz-answer" />
      </div>
    </Link>
  );
};

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [invited, setInvited] = useState<UserInvitedUsers[] | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  useEffect(() => {
    fetch(`${process.env.API_URL}/users/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
    })
      .then((res) => res.json())
      .then((data: UserData) => {
        setUser(data.user);
      });
    fetch(`${process.env.API_URL}/user/getInvitedUsers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
    })
      .then((res) => res.json())
      .then((data: UserInvitedUsersData) => {
        setInvited(data.data);
      });
  }, []);
  return (
    <AccountLayout>
      {isOpen && <AccessModal onClose={() => setIsOpen(false)} />}

      <h1 className="shrink text-4xl font-medium">Moje konto</h1>
      <section className="kontener sm:kontener-rounded grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8 w-full p-4 lg:p-10">
        <div className="kontener-rounded flex flex-col justify-start flex-wrap bg-hover-color2 py-5 px-10">
          <HiOutlineLightBulb className="text-3xl text-fiolet-quiz-answer" />
          <br />
          <div className="flex flex-nowrap justify-between items-center">
            <span>
              Liczba punktów:{" "}
              <span className="font-bold">{user && user.points}</span>
            </span>
          </div>
        </div>
        <div className="kontener-rounded flex flex-col justify-start flex-wrap bg-hover-color2 py-5 px-10">
          <img
            src="/diamencik_gold.png"
            width={30}
            height={30}
            className="text-3xl text-waiting-yellow"
          />
          <br />
          <div className="flex flex-nowrap justify-between items-center">
            <span>
              Twój pakiet:{" "}
              <span className="font-bold">
                {plan?.data ? "Premium" : "Standard"}
              </span>
            </span>
          </div>
        </div>
        <Link passHref href="/account/invited">
          <div className="kontener-rounded cursor-pointer flex flex-col justify-start flex-wrap bg-hover-color2 py-5 px-10">
            <HiOutlineLightBulb className="text-3xl text-blue-quiz-answer" />
            <br />
            <div className="flex flex-nowrap justify-between items-center">
              <span>
                Liczba poleconych osób:{" "}
                <span className="font-bold">{invited && invited.length}</span>
              </span>
              <div className="justify-self-end">
                <BsArrowRight className="justify-self-end text-xl text-green-quiz-answer" />
              </div>
            </div>
          </div>
        </Link>
        <div
          onClick={handleClick}
          className="kontener-rounded cursor-pointer flex flex-col justify-start flex-wrap bg-hover-color2 py-5 px-10"
        >
          <AiOutlinePlusCircle className="text-3xl text-red-quiz-answer" />
          <br />
          <div className="flex flex-nowrap justify-between items-center">
            <span>Dodaj nowy quiz</span>
            <div className="justify-self-end">
              <BsArrowRight className="justify-self-end text-xl text-green-quiz-answer" />
            </div>
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2"></div>
        <h1 className="sm:col-span-2 lg:col-span-1 xl:col-span-2 text-3xl font-medium">
          Szybki dostęp
        </h1>
        <BlockyButton
          Icon={AiOutlineDollar}
          bgColor="blocky-purple"
          iconColor="fiolet-quiz-answer"
          text="Moje środki"
          href="/account/funds"
        />
        <BlockyButton
          Icon={HiOutlineCreditCard}
          bgColor="blocky-purple"
          iconColor="red-quiz-answer"
          text="Płatności"
          href="/account/payments"
        />
        <BlockyButton
          Icon={BsDice5}
          bgColor="blocky-purple"
          iconColor="green-quiz-answer"
          text="Moje quizy"
          href="/account/quizzes"
        />
        <BlockyButton
          Icon={FiSettings}
          bgColor="blocky-purple"
          iconColor="blue-quiz-answer"
          text="Ustawienia"
          href="/account/settings"
        />
      </section>
    </AccountLayout>
  );
};

export default Account;
