import { useEffect, useState } from "react";

import AccountLayout from "@components/Layout/AccountLayout";
import axiosInstance from "@root/util/fetch";

const Settings = () => {
  const [settings, setSettings] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    companyName: "",
    nip: "",
    regon: "",
    postcodeCity: "",
    street: "",
    buildingNumber: "",
    houseNumber: "",
    iban: "",
    bankName: "",
    swift: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    company_name: "",
    nip: "",
    regon: "",
    postcode: "",
    city: "",
    street: "",
    building_number: "",
    house_number: "",
    iban: "",
    bank_name: "",
    swift: "",
  });

  const changeSettingInput = (e: any) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  useEffect(() => {
    axiosInstance
      .get(`/user/settings`)
      .then((data) => data.data)
      .then((data: any) => {
        setSettings({
          name: data.personal.name,
          surname: data.personal.surname,
          email: data.personal.email,
          phone: data.personal.phone,
          companyName: data.company.name,
          nip: data.company.nip,
          regon: data.company.regon,
          postcodeCity: `${data.company.address.postcode} ${data.company.address.city}`,
          street: data.company.address.street,
          buildingNumber: data.company.address.building_number,
          houseNumber: data.company.address.house_number,
          iban: data.financial.iban,
          bankName: data.financial.bank_name,
          swift: data.financial.swift,
        });
      });
  }, []);

  const editSettings = () => {
    const body: any = {
      name: settings.name,
      surname: settings.surname,
      email: settings.email,
      phone: settings.phone.match(
        RegExp(".{1," + Math.ceil(settings.phone.length / 3) + "}", "g")
      ),
      company_name: settings.companyName,
      nip: settings.nip,
      regon: settings.regon,
      postcode: settings.postcodeCity.split(" ", 2)[0],
      city: settings.postcodeCity.split(" ", 2)[1],
      street: settings.street,
      building_number: settings.buildingNumber,
      house_number: settings.houseNumber,
      iban: settings.iban,
      bank_name: settings.bankName,
      swift: settings.swift,
    };
    setErrors({
      name: "",
      surname: "",
      email: "",
      phone: "",
      company_name: "",
      nip: "",
      regon: "",
      postcode: "",
      city: "",
      street: "",
      building_number: "",
      house_number: "",
      iban: "",
      bank_name: "",
      swift: "",
    });

    axiosInstance
      .post(`/user/settings`, body)
      .then((res) => {
        if (res.data.success) {
          alert(`Pomyślnie zaktualizowano ustawienia`);
          window.location.reload();
        }
      })
      .catch((err) => {
        let errs: any = { ...errors };
        Object.entries(err.response.data.errors).forEach(([key, value]) => {
          if (key.split(".", 2)[0] === "phone") {
            errs["phone"] = errs["phone"] + "\n" + value;
          }
          errs[key] = value;
        });
        setErrors(errs);
      });
  };
  return (
    <AccountLayout section="settings">
      <h1 className="text-4xl font-medium">Ustawienia</h1>
      <div className="kontener sm:kontener-rounded p-4 lg:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-7">
        <p className="sm:col-span-2 lg:col-span-1 xl:col-span-2 text-2xl font-medium">
          Dane osobowe
        </p>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="name">Imię:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="JAN"
            name="name"
            value={settings.name}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.name && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.name}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="surname">Nazwisko:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="KOWALSKI"
            name="surname"
            value={settings.surname}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.surname && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.surname}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="email">Adres e-mail:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="JAN@KOWALSKI.PL"
            name="email"
            value={settings.email}
            type="email"
            onChange={changeSettingInput}
          />
          {errors.email && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.email}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="phone">Numer telefonu:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="111111111"
            name="phone"
            value={settings.phone}
            type="tel"
            min={9}
            max={9}
            pattern="[0-9]{9}"
            onChange={changeSettingInput}
          />
          {errors.phone && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.phone}
            </div>
          )}
        </div>
      </div>
      <div></div>
      <h1 className="text-4xl font-medium">Dane do faktury</h1>
      <div className="kontener sm:kontener-rounded grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-7 p-4 lg:p-10">
        <p className="sm:col-span-2 lg:col-span-1 xl:col-span-2 text-2xl font-medium">
          Dane firmy
        </p>
        <div
          className={`sm:col-span-2 lg:col-span-1 xl:col-span-2 flex flex-col gap-1`}
        >
          <label htmlFor="companyName">Nazwa działalności:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="PRZYKŁADOWA NAZWA DZIAŁALNOŚCI GOSPODARCZEJ"
            name="companyName"
            value={settings.companyName}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.company_name && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.company_name}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="nip">Numer NIP:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="1111111111111"
            name="nip"
            value={settings.nip}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.nip && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.nip}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="regon">Numer REGON:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="111111111"
            name="regon"
            value={settings.regon}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.regon && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.regon}
            </div>
          )}
        </div>
        <p className="sm:col-span-2 lg:col-span-1 xl:col-span-2 text-2xl font-medium">
          Siedziba działalności
        </p>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="postcodeCity">Kod pocztowy oraz miejscowość:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="11-111 KRAKÓW"
            name="postcodeCity"
            value={settings.postcodeCity}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.postcode ||
            (errors.city && (
              <div
                className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
                role="alert"
              >
                {errors.postcode}
              </div>
            ))}
          {/* {errors.postcode && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.postcode}
            </div>
          )} */}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="street">Ulica:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="WIŚLANA"
            name="street"
            value={settings.street}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.street && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.street}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="buildingNumber">Numer mieszkania:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="48B"
            name="buildingNumber"
            value={settings.buildingNumber}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.building_number && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.building_number}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="houseNumber">Numer lokalu:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="30"
            name="houseNumber"
            value={settings.houseNumber}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.house_number && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.house_number}
            </div>
          )}
        </div>
      </div>
      <div></div>
      <h1 className="text-4xl font-medium">Dane finansowe</h1>
      <div className="kontener sm:kontener-rounded grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-7 p-4 lg:p-10">
        <p className="sm:col-span-2 lg:col-span-1 xl:col-span-2 text-2xl my-4 font-medium">
          Wypłaty środków
        </p>
        <div
          className={`sm:col-span-2 lg:col-span-1 xl:col-span-2 flex flex-col gap-1`}
        >
          <label htmlFor="iban">Numer IBAN:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="PL 11111111111111111111111"
            name="iban"
            value={settings.iban}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.iban && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.iban}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="bankName">Nazwa banku:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="X BANK"
            name="bankName"
            value={settings.bankName}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.bank_name && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.bank_name}
            </div>
          )}
        </div>
        <div className={`flex flex-col gap-1`}>
          <label htmlFor="swift">Numer SWIFT:</label>
          <input
            className="show-spin min-w-64 max-w-2xl border border-neutral-200 border-gray-300 rounded-lg p-2"
            placeholder="ABC11111111"
            name="swift"
            value={settings.swift}
            type="text"
            onChange={changeSettingInput}
          />
          {errors.swift && (
            <div
              className="bg-red-100 rounded-lg py-3 px-4 text-base text-red-700"
              role="alert"
            >
              {errors.swift}
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={editSettings}
        className="bg-menu-hover px-3 py-2 rounded-lg text-white justify-self-end"
      >
        Zapisz zmiany
      </button>
    </AccountLayout>
  );
};

export default Settings;
