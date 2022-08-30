import AccountLayout from "@components/Layout/AccountLayout";
import axiosInstance from "@root/util/fetch";
import dayjs from "dayjs";
import { useQuery } from "react-query";

const Payments = () => {
  const payments = useQuery("payments", () => axiosInstance.get("/payments"));
  const downloadInvoice = (id: string) => {
    axiosInstance.get(`/payments/${id}/download`).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    });
  };
  return (
    <AccountLayout section="payments">
      <h1 className="text-4xl font-medium">Płatności</h1>
      {payments?.data?.data?.data.length > 0 ? (
        <section className="kontener sm:kontener-rounded min-h-[42rem] sm:p-5">
          <table className="w-full table-auto">
            <tr className="bg-hover-color2 font-bold">
              <td className="sm:rounded-l-2xl p-4">Pakiet</td>
              <td>Data zakupu</td>
              <td>Czas wygaśnięcia</td>
              <td className="sm:rounded-r-2xl"></td>
            </tr>
            {payments?.data?.data?.data.map((payment: any) => (
              <tr
                key={payment.id}
                className="border-b border-platnosci-line-border text-platnosci-text"
              >
                <td className="px-4 py-6">{payment.title}</td>
                  <td>{payment.purchaseDate}</td>
                  <td>{payment.expiryDate}</td>
                <td>
                  <div
                    onClick={() => downloadInvoice(payment.invoice_id)}
                    className="cursor-pointer text-white bg-platnosci-faktura py-2 px-6 rounded-lg float-right"
                  >
                    Pobierz fakturę
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </section>
      ) : (
        <section className="grow min-h-[42rem] kontener sm:kontener-rounded flex flex-wrap gap-5 w-full p-4 lg:p-10">
          <div className="text-center text-2xl">Brak historii płatności</div>
        </section>
      )}
    </AccountLayout>
  );
};

export default Payments;
