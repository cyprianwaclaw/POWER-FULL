import Link from "next/link";
import AsyncSelect from "react-select/async";
import Router from "next/router";
import { parseCookies } from "nookies";
import { useState } from "react";
import axiosInstance from "@root/util/fetch";
import { useQuery } from "react-query";

const loadOptions = (inputValue: string) =>
  new Promise<any>((resolve) => {
    fetch(`${process.env.API_URL}/quizzes?search=${inputValue}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${parseCookies()["access_token"]}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        resolve(
          res.data.data.map((quiz: any) => ({
            value: quiz.id,
            label: quiz.title,
          }))
        );
      });
  });

export const Navbar = () => {
  const [isSelectLoading, setIsSelectLoading] = useState(false);
  const user = useQuery("users-current", () =>
    axiosInstance.get("/users/current").then((res) => res.data.user)
  );
  return (
    <nav className="bg-white border-gray-200 pt-3 pb-6 px-20">
      <div className="flex flex-wrap justify-between content-around gap-y-5 items-center">
        <div className="flex flex-cols items-center">
          <Link passHref href="/">
            <span className="self-center cursor-pointer text-2xl font-bold whitespace-nowrap mr-36">
              LOGO
            </span>
          </Link>
          <div>
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              isLoading={isSelectLoading}
              onChange={(value: any) => {
                setIsSelectLoading(true);
                Router.push(`/quiz/${value.value}`);
              }}
              defaultOptions
              placeholder="Wyszukaj quiz..."
              className="w-[18rem] hidden md:block"
              classNamePrefix="select"
              instanceId={"search-quiz"}
              styles={{
                control: (provided: any) => ({
                  ...provided,
                  backgroundColor: "rgb(249, 249, 249)",
                  border: "2px solid rgb(231 232 233 / 1)",
                  borderRadius: "2rem",
                  boxShadow: "none",
                }),
                menu: (provided: any) => ({
                  ...provided,
                  backgroundColor: "rgb(249, 249, 249)",
                  border: "none",
                  boxShadow: "none",
                }),
                input: (provided: any) => ({
                  ...provided,
                  backgroundColor: "rgb(249, 249, 249)",
                  // border: "2px solid rgb(231 232 233 / 1)",
                  border: "none",
                  borderRadius: "2rem",
                  boxShadow: "none",
                }),
                option: (provided: any) => ({
                  ...provided,
                  // backgroundColor: "#F9F9F9",
                  border: "none",
                  borderRadius: "5px",
                  boxShadow: "none",
                }),
              }}
            />
          </div>
        </div>
        <div className="flex flex-cols gap-5 items-center">
          <div className="hidden w-full md:block md:w-auto" id="mobile-menu">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              <li>
                <Link passHref href="/quizzes">
                  <span className="block cursor-pointer font-bold py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">
                    Quizy
                  </span>
                </Link>
              </li>
              <li>
                <Link passHref href="/invite-friends">
                  <span className="cursor-pointer py-2 px-4 tracking-wide font-semibold text-xs text-black border-2 rounded-3xl hover:bg-hover-color">
                    Zaproś znajomych
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <Link passHref href="/account">
            <div className="cursor-pointer flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300">
              <img
                className="w-8 h-8 object-cover rounded-full"
                src={user?.data?.avatar_path ?? "/images/100.png"}
                alt="user photo"
                width={37}
                height={37}
              />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};
