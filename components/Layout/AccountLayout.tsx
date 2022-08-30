import Router from "next/router";
import Link from "next/link";
import { destroyCookie, parseCookies } from "nookies";
import { useRef } from "react";
import axiosInstance from "@root/util/fetch";
import { useQuery } from "react-query";

import { Layout } from "./Layout";

import { HiOutlineCreditCard, HiOutlineLogout } from "react-icons/hi";
import { AiOutlineDollar } from "react-icons/ai";
import { BsDice5 } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { RiRedPacketLine } from "react-icons/ri";

interface Props {
  children: React.ReactNode;
  section?: "funds" | "payments" | "quizzes" | "settings" | "packets";
}

const AccountLayout = ({ children, section }: Props) => {
  const logout = () => {
    destroyCookie(null, "access_token");
    Router.push("/login");
  };
  const user = useQuery("users-current", () =>
    axiosInstance.get("/users/current").then((res) => res.data.user)
  );
  const fileInput = useRef<HTMLInputElement>(null);
  const changeAvatar = () => {
    fileInput.current?.click();
  };
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("avatar", image);
    fetch(`${process.env.API_URL}/user/uploadAvatar`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        Router.reload();
      });
  }
  return (
    <Layout withGrid={false}>
      <div className="flex flex-col lg:flex-row gap-10  sm:m-7 lg:m-14">
        <section className="kontener sm:kontener-rounded lg:flex-none lg:min-w-[27rem] h-[42rem] grid grid-flow-row py-10">
          <div className="justify-self-center">
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept=".jpg, .jpeg, .png"
              ref={fileInput}
            />
            <div onClick={changeAvatar} className="cursor-pointer">
              <img
                className="rounded-full object-cover w-36 h-36"
                src={user?.data?.avatar_path ?? "/images/100.png"}
                alt="awatar"
              />
              {/* <span
                className="cursor-pointer absolute bottom-5 right-0 transform translate-y-1/4 w-fit h-fit rounded-full p-2"
                style={{ backgroundColor: "#5B5B5B" }}
              >
                <AiOutlineCamera className="text-white text-2xl" />
              </span> */}
            </div>
          </div>
          <h1 className="text-center text-3xl my-6">{user?.data?.name}</h1>
          <Link passHref href="/account/funds">
            <div
              className={`cursor-pointer flex text-xl justify-center lg:justify-start hover:bg-hover-color2 ${
                section == "funds" ? "bg-hover-color2" : null
              }`}
            >
              <div className="flex flex-nowrap items-center lg:pl-10 py-2">
                <AiOutlineDollar className="m-3 text-fiolet-quiz-answer" />
                <span>Moje środki</span>
              </div>
            </div>
          </Link>
          <Link passHref href="/account/payments">
            <div
              className={`cursor-pointer flex text-xl justify-center lg:justify-start hover:bg-hover-color2 ${
                section == "payments" ? "bg-hover-color2" : null
              }`}
            >
              <div className="flex flex-nowrap items-center lg:pl-10 py-2">
                <HiOutlineCreditCard className="m-3 text-red-quiz-answer" />
                <span>Płatności</span>
              </div>
            </div>
          </Link>
          <Link passHref href="/account/quizzes">
            <div
              className={`cursor-pointer flex text-xl justify-center lg:justify-start hover:bg-hover-color2 ${
                section == "quizzes" ? "bg-hover-color2" : null
              }`}
            >
              <div className="flex flex-nowrap items-center lg:pl-10 py-2">
                <BsDice5 className="m-3 text-green-quiz-answer" />
                <span>Moje quizy</span>
              </div>
            </div>
          </Link>
          <Link passHref href="/account/settings">
            <div
              className={`cursor-pointer flex text-xl justify-center lg:justify-start hover:bg-hover-color2 ${
                section == "settings" ? "bg-hover-color2" : null
              }`}
            >
              <div className="flex flex-nowrap items-center lg:pl-10 py-2">
                <FiSettings className="m-3 text-blue-quiz-answer" />
                <span>Ustawienia</span>
              </div>
            </div>
          </Link>
          <Link passHref href="/account/packets">
            <div
              className={`cursor-pointer flex text-xl justify-center lg:justify-start hover:bg-hover-color2 ${
                section == "packets" ? "bg-hover-color2" : null
              }`}
            >
              <div className="flex flex-nowrap items-center lg:pl-10 py-2">
                <RiRedPacketLine className="m-3" />
                <span>Pakiety</span>
              </div>
            </div>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer flex text-xl justify-center lg:justify-start hover:bg-hover-color2"
          >
            <div className="flex flex-nowrap items-center lg:pl-10 py-2">
              <HiOutlineLogout className="m-3 text-gray" />
              <span>Wyloguj się</span>
            </div>
          </button>
        </section>
        <section className="grow grid grid-flow-row gap-10">{children}</section>
      </div>
    </Layout>
  );
};

export default AccountLayout;
export { AccountLayout };
