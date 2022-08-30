import Image from "next/image";
import axiosInstance from "@root/util/fetch";
import Router from "next/router";

import Negative from "@public/negative.svg";
import Arrow from "@public/arrow.svg";

interface Props {
  onClose?: () => void;
}

export const AccessModal = ({ onClose }: Props) => {
  const handleSuccess = () => {
    axiosInstance
      .post("/buy-plan", {
        plan: 2,
      })
      .then((res) => {
        Router.push(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        alert("Wystąpił niespodziewany błąd");
      });
  };
  return (
    <div
      id="access-modal"
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full"
    >
      <div
        id="access-modal-window"
        className="relative p-4 w-full max-w-xl h-full md:h-auto"
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            data-modal-toggle="popup-modal"
          >
            <svg
              onClick={onClose}
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-8 sm:p-10 text-center">
            <Image src={Negative} height="50" width="50" alt="result icon" />
            <h2 className="mb-2 mt-2 text-2xl font-semibold text-black-500 dark:text-black-400">
              Dostęp zabroniony
            </h2>
            <h3 className="mb-4 text-md font-normal text-[#5E5E5E] dark:text-gray-400">
              Dostęp do tej sekcji serwisu mają jedynie użytkownicy, którzy
              wykupili pakiet Premium.
            </h3>
            <div id="buttons-wrapper">
              <button
                id="access-button"
                data-modal-toggle="popup-modal"
                type="button"
                onClick={onClose}
                className="text-center text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              >
                Zamknij Komunikat
              </button>
              <button
                id="access-button"
                data-modal-toggle="popup-modal"
                type="button"
                onClick={handleSuccess}
                className="text-center text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Kup Pakiet Premium
                <Image src={Arrow} height="30" width="30" alt="result icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
