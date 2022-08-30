import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import axiosInstance from "@root/util/fetch";
import Router from "next/router";
import { AccessModal } from "@components/Modals";
import {
  AiOutlineMenu,
  AiOutlinePlusCircle,
  AiOutlineUser,
} from "react-icons/ai";
import { BsDice5 } from "react-icons/bs";
import { BiHomeAlt } from "react-icons/bi";
import { VscChromeClose } from "react-icons/vsc";
import { useQuery } from "react-query";

export const Sidebar = () => {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [status, setStatus] = useState(false);
  const toogleNav = () => {
    setStatus(!status);
  };

  const user = useQuery("users-current", () =>
    axiosInstance.get("/users/current").then((res) => res.data.user)
  );
  const plan = useQuery("user-getPlan", () =>
    axiosInstance.get("/user/getPlan").then((res) => res.data)
  );
  const stats = useQuery("user-stats", () =>
    axiosInstance.get("/user/stats").then((res) => res.data.data)
  );

  const handleClick = (route: string) => {
    if (!plan.data.data) {
      setIsOpen(true);
    } else {
      Router.push(route === "Quizy" ? "/quizzes" : "/create-quiz");
    }
  };

  return (
    <>
      {isOpen && <AccessModal onClose={() => setIsOpen(false)} />}
      <div
        className="grid fixed text-white h-full bg-sidebar-bg justify-items-center"
        style={{
          width: "22rem",
          transition: "all 0.5s ease-in-out",
          left: status ? "0" : "-18rem",
        }}
      >
        <div className="mt-8">
          <div
            className="text-2xl cursor-pointer absolute top-0 right-0 m-5"
            onClick={toogleNav}
          >
            {status ? <VscChromeClose /> : <AiOutlineMenu />}
          </div>

          <div className="flex flex-row flex-nowrap content-center items-center my-10">
            <img
              className="object-cover rounded-full w-12 h-12"
              src={user?.data?.avatar_path ?? "/images/100.png"}
              alt="user photo"
            />
            <h1 className="text-2xl ml-3 font-bold">{user?.data?.name}</h1>
          </div>
          <div>
            <p className="m-5">Pakiet: {plan?.data ? "Premium" : "Standard"}</p>
            <p className="m-5">Liczba punktów: {user?.data?.points}</p>
            <p className="m-5">
              Poprawne odpowiedzi: {stats?.data?.correct_answers}
            </p>
            <p className="m-5">
              Błędne odpowiedzi: {stats?.data?.incorrect_answers}
            </p>
          </div>
          <hr className="my-10 w-11/12" />
          <div className="text-xl">
            <Link passHref href="/">
              <div className="m-1 p-3 cursor-pointer hover:bg-menu-hover hover:rounded-lg">
                <BiHomeAlt className="align-middle inline-block mx-2" />
                <span className="align-middle inline-block">Strona główna</span>
              </div>
            </Link>
            <div
              onClick={() => handleClick("Quizy")}
              className="m-1 p-3 cursor-pointer hover:bg-menu-hover hover:rounded-lg"
            >
              <BsDice5 className="align-middle inline-block mx-2" />
              <span className="align-middle inline-block">Quizy</span>
            </div>
            <div
              onClick={() => handleClick("Dodaj nowy")}
              className="m-1 p-3 cursor-pointer hover:bg-menu-hover hover:rounded-lg"
            >
              <AiOutlinePlusCircle className="align-middle inline-block mx-2" />
              <span className="align-middle inline-block">Dodaj nowy</span>
            </div>
            <Link passHref href="/account">
              <div className="m-1 p-3 cursor-pointer hover:bg-menu-hover hover:rounded-lg">
                <AiOutlineUser className="align-middle inline-block mx-2" />
                <span className="align-middle inline-block">Moje konto</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
