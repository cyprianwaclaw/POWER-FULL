import Link from "next/link";
import Router from "next/router";
import { setCookie } from "nookies";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();
  const [registerError, setRegisterError] = useState("");

  const [name, setName] = useState("test5");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test123456");
  const [password_confirmation, setPasswordConfirmation] =
    useState("test123456");
  const [invitation, setInvitation] = useState("y12rOwSuEDxuI3691N1v");

  useEffect(() => {
    if (router.query.inv_token && typeof router.query.inv_token === "string") {
      setInvitation(router.query.inv_token);
    }
  }, [router.query.inv_token]);

  const register = async () => {
    const res = await fetch(`${process.env.API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation,
        invitation,
      }),
    });

    if (res.status === 404) {
      setRegisterError("Nie ma takiego użytkownika");
      return;
    }

    const data = await res.json();
    if (data && data.access_token) {
      setCookie(null, "access_token", data.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      Router.push("/");
    } else {
      setRegisterError("Wystąpił niespodziewany błąd");
    }
  };
  return (
    <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900">
      <section className="flex w-[30rem] flex-col space-y-10 mx-5">
        <div className="text-center text-4xl font-medium">Zarejestruj się</div>

        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="text"
            placeholder="Nazwa"
            name="name"
            maxLength={55}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
        </div>
        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="email"
            placeholder="Adres email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
        </div>
        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="password"
            placeholder="Hasło"
            name="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
        </div>

        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="password"
            placeholder="Powtórz hasło"
            name="password_confirmation"
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
        </div>

        <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
          <input
            type="text"
            placeholder="Kod zaproszenia"
            name="invitation"
            minLength={20}
            maxLength={20}
            value={invitation}
            onChange={(e) => setInvitation(e.target.value)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={register}
          className="transform rounded-sm text-white bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
        >
          ZAREJESTRUJ SIĘ
        </button>

        {/* <Link href="/reset-password">
              <div className="transform text-center font-semibold text-gray-500 duration-300 hover:text-gray-300">
                FORGOT PASSWORD?
              </div>
            </Link> */}

        <p className="flex flex-nowrap justify-center text-center text-lg">
          Posiadasz już konto?
          <Link href="/login">
            <div className="cursor-pointer font-medium mx-2 text-indigo-500 underline-offset-4 hover:underline">
              Zaloguj się
            </div>
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
