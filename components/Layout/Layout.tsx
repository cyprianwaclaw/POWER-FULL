import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { ReactNode } from "react";

interface Props {
  withGrid?: boolean;
  children: ReactNode;
}

export const Layout = ({ children, withGrid = true }: Props) => {
  return (
    <div>
      <Sidebar />
      <main style={{ marginLeft: "4rem" }}>
        <Navbar />
        {withGrid ? (
          <div
            className="mx-auto p-3 lg:p-10 gap-3 lg:gap-10 grid grid-cols-1"
            style={{ maxWidth: "86rem" }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};
