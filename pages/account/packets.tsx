import AccountLayout from "@components/Layout/AccountLayout";
import axiosInstance from "@root/util/fetch";
import Router from "next/router";

const Packets = () => {
  const subscribePremium = (id: number) => {
    axiosInstance
      .post("/buy-plan", {
        plan: id,
      })
      .then((res) => {
        Router.push(res.data.data);
      })
      .catch((err) => {
        alert("Wystąpił niespodziewany błąd");
      });
  };
  return (
    <AccountLayout section="packets">
      <h1 className="text-4xl font-semibold">Dostępne pakiety</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full min-h-[40rem]">
        <div className="bg-white kontener sm:kontener-rounded p-20 grid grid-flow-row">
          <img src="/diamencik_lg.png" className=" mx-auto rounded-full" />
          <span className="  mx-auto text-3xl font-bold mb-5">
            Pakiet Premium
          </span>
          <ul id="invite" className="text-lg">
            <li className="p-2 font-normal">granie w quizy</li>
            <li className="p-2 font-normal">polecanie osób</li>
            <li className="p-2 font-normal">dodawanie własnych quizów</li>
            <li className="p-2 font-normal">
              dodatkowe punkty{" "}
              <span className="text-[#33B970]">które można wypłacić</span> za
              zakup pakietu przez Twojego poleconego
            </li>
            <li className="p-2 font-normal">
              pierwsze 1 000 poleconych osób otrzymuje dożywotnio{" "}
              <span className=" text-[#33B970]">Pakiet Premium</span>
            </li>
          </ul>
          <br />
          <div className="flex flex-row justify-between gap-3">
            <button
              type="button"
              onClick={() => subscribePremium(2)}
              className="py-2 px-8 text-white bg-menu-hover rounded-xl"
            >
              Kup Premium 7 dni
            </button>
            <button
              type="button"
              onClick={() => subscribePremium(3)}
              className="py-2 px-8 text-white bg-menu-hover rounded-xl"
            >
              Kup Premium 30 dni
            </button>
          </div>
        </div>
        <div className="bg-white kontener sm:kontener-rounded p-20 grid grid-flow-row">
          <img src="/listek_lg.png" className=" mx-auto rounded-full" />
          <span className="mx-auto text-3xl font-bold mb-5">
            Pakiet Standard
          </span>
          <ul id="invite" className="text-lg">
            <li className="p-2">granie w quizy</li>
            <li className="p-2">polecanie osób</li>
            <li className="p-2">dodawanie własnych quizów</li>
            <ul id="invitedeleted">
              <li className="p-2 text-[#AFAFAF]">
                dodatkowe punkty które można wypłacić za zakup pakietu przez
                Twojego poleconego
              </li>
              <li className="p-2 text-[#AFAFAF]">
                pierwsze 1 000 poleconych osób otrzymuje dożywotnio Pakiet
                Standard
              </li>
            </ul>
          </ul>
        </div>
      </section>
    </AccountLayout>
  );
};

export default Packets;
