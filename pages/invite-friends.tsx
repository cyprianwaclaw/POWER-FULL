import Layout from "@components/Layout";
import Link from "next/link";
import Image from "next/image";
import { parseCookies } from "nookies";

import { BsChevronRight } from "react-icons/bs";
import axiosInstance from "@root/util/fetch";

const ZaprosZnajomych = () => {
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
    <Layout>
      <section className="kontener kontener-rounded p-10 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold mb-5">
            Zaproś znajomych do <br/> wspólnej gry
          </h1>
          <div className="text-neutral-500 leading-relaxed text-lg ">
            <p>
              Zaproś swoich znajomych do gry i oboje zyskajcie dodatkowe
              korzyści oraz super zabawę z rozwiązywania quizów i dodawania
              własnych.
              Wystarczy że skopiujesz poniższy kod z którego będzie mógł
              zarejestrować się Twój znajomy
            </p>
          </div>
          <button
            type="button"
            onClick={copyInviteCode}
           
            className="bg-menu-hover p-3 rounded-lg text-white mt-5"
          >
            Skopiuj kod polecający
          </button>
        </div>
        <div className="relative">
          <Image
            className=""
            src={"/people.svg"}
            layout="fill"
            alt="people image"
          />
        </div>
      </section>

      <section className="grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-3 lg:gap-10">
        <div className="kontener kontener-rounded p-10">
          <h1 className="text-3xl font-bold mb-5">Dla Ciebie</h1>
          <ul id="invite" className="ml-6">
            <li className="my-4">
              Zdobywasz punkty, za które możesz kupić pakiet Premium lub
              wypłacić przelewem na swoje konto
            </li>
            <li className="my-4">
              Dodatkowe punkty, gdy Twoi poleceni wykupią pakiet Premium na
              okres miesięczny - dodatkowe 36 punktór lub tygodniowy - dodatkowe
              11 punktów, które możesz wypłacić albo kupić pakiet premium
            </li>
            <li className="my-4">
              Aby móc zapraszać osoby musisz mieć aktywny pakiet premium, więcej
              o tym pakiecie możesz dowiedzieć się tutaj
            </li>
          </ul>
          <div className="mt-7">
            <Link href={"/account/packets"}>
              <span className="bg-menu-hover text-white p-3 rounded-lg cursor-pointer">
                Pakiet Premium
              </span>
            </Link>
          </div>
        </div>

        <div className="kontener kontener-rounded p-10">
          <h1 className="text-3xl font-bold mb-5">Dla Twojego poleconego</h1>
          <ul id="invite" className="list-disc ml-6">
            <li className="my-4">Dożywotnio pakiet Premium</li>
            <li className="my-4">Świetna zabawa z rozwiązywania quizów</li>
          </ul>
          <Link href={"/account/invited"}>
            <div className="text-right mt-7 cursor-pointer">
              <span className="align-middle inline-block">
                Zobacz swoich poleconych
              </span>
              <BsChevronRight className="m-1 align-middle inline-block text-menu-hover" />
            </div>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ZaprosZnajomych;
