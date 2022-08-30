interface Props {
  width?: number;
  hide?: boolean;
}

export const SearchBar = ({ width, hide = false }: Props) => {
  return (
    <div
      className={`${hide ? null : "hidden md:block"} relative`}
      style={{
        marginLeft: "58px",
        width: `${width ?? "18"}rem`,
      }}
    >
      <div className="flex absolute inset-y-0 right-0 items-center rounded-full mr-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <input
        type="text"
        id="email-adress-icon"
        className="border-border-filter block p-1.5 pl-4 w-full text-gray-900 rounded-5 border-2 sm:text-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Wyszukaj quiz..."
        style={{
          backgroundColor: "#F9F9F9",
        }}
      />
    </div>
  );
};
