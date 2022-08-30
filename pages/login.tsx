import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { setCookie } from "nookies";

const Login = () => {
  const [loginError, setLoginError] = useState("");

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test123456");

  const login = async () => {
    const res = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.status === 404) {
      setLoginError("Nie ma takiego użytkownika");
      return;
    }

    const data = await res.json();
    if (data && data.access_token) {
      // localStorage.setItem("access_token", data.access_token);
      setCookie(null, "access_token", data.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      Router.push("/");
    } else {
      setLoginError("Wystąpił niespodziewany błąd");
    }
  };
  return (
    <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900">
      <section className="flex w-[30rem] flex-col space-y-10 mx-5">
        <div className="text-center text-4xl font-medium">Zaloguj się</div>
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
            value={password}
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={login}
          className="transform rounded-sm text-white bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400"
        >
          ZALOGUJ SIĘ
        </button>

        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        {/* <Link href="/reset-password">
          <div className="transform text-center font-semibold text-gray-500 duration-300 hover:text-gray-300">
            FORGOT PASSWORD?
          </div>
        </Link> */}

        <p className="flex flex-nowrap justify-center text-center text-lg">
          Nie posiadasz konta?
          <Link href="/register">
            <div className="cursor-pointer font-medium mx-2 text-indigo-500 underline-offset-4 hover:underline">
              Zarejestruj się
            </div>
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
