import { UserInvitedUsers } from "@root/types/api/api";

import AccountLayout from "@components/Layout/AccountLayout";
import axiosInstance from "@root/util/fetch";
import { useQuery } from "react-query";

const InvitedUser = (user: UserInvitedUsers) => {
  return (
    <div
      className={`kontener-rounded h-[14.5rem] w-[14.125rem] flex flex-col flex-wrap justify-center content-center bg-${
        user.is_premium ? "premium-user" : "standard-user"
      }`}
    >
      <img
        src={"/images/awatar.jpeg"}
        className="mx-auto rounded-full w-[5.875rem] h-[5.5rem]"
        alt="avatar"
      />
      <div className="text-3xl py-3 mx-auto">{user.name}</div>
      <div
        className="text-xl w-fit mx-auto flex flex-nowrap content-center items-center "
        style={{
          color: user.is_premium ? "#C69E06" : "#29724A",
        }}
      >
        {user.is_premium ? (
          <img className="w-5 h-5" src={"/diamencik.png"} />
        ) : (
          <img className="w-5 h-5" src={"/listek.png"} />
        )}
        {user.is_premium ? "Premium" : "Standard"}
      </div>
    </div>
  );
};

const Invited = () => {
  const invited = useQuery("user-getInvitedUsers", () =>
    axiosInstance.get("/user/getInvitedUsers")
  );
  return (
    <AccountLayout>
      <h1 className="shrink text-4xl font-medium">Lista poleconych osób</h1>
      <section className="grow min-h-[42rem] kontener sm:kontener-rounded flex flex-wrap gap-5 w-full p-4 lg:p-10">
        {invited?.data?.data?.data.length > 0 ? (
          invited?.data?.data?.data.map((invited: any) => (
            <div key={`invited-user-${invited.id}`}>
              <InvitedUser
                id={invited.id}
                name={invited.name}
                is_premium={invited.is_premium}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-2xl">Brak poleconych osób</div>
        )}
      </section>
    </AccountLayout>
  );
};

export default Invited;
