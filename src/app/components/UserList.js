import React from "react";

export const UserList = ({
  selectedUser,
  setSelectedUser,
  users,
  setSelectedReceipt,
  setChange,
  selectedReceipt,
}) => {
  function changeUser() {
    document.getElementById("name-header").classList.add("hidden");
    document.getElementById("user-list").style.display = "";
  }

  function selectUser(e) {
    if (e.target.textContent === "Overview") {
      setSelectedReceipt("");
    }
    document.getElementById("name-header").classList.remove("hidden");
    document.getElementById("user-list").style.display = "none";
    setSelectedUser(e.target.textContent);
    setChange((prevChange) => prevChange + 1);
  }

  return (
    <section id="header" className="">
      {selectedReceipt !== "" ? (
        <div className="flex justify-center">
          <h1 className="text-title font-bold text-accent">
            {selectedReceipt}
          </h1>
        </div>
      ) : null}
      <button
        id={"name-header"}
        onClick={changeUser}
        className="text-title font-medium w-fit border-2 p-4 rounded-md"
      >
        {selectedUser}
      </button>
      <div id={"user-list"} className="w-screen" style={{ display: "none" }}>
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              selectUser(e);
            }}
            className="text-title w-fit border-2 p-4 rounded-md mb-2 "
          >
            Overview
          </button>
        </div>
        <ul className="flex flex-wrap justify-evenly">
          {users
            ? users.map((user) => (
                <li key={`${user} list`}>
                  <button
                    onClick={(e) => {
                      selectUser(e);
                    }}
                    className="text-title w-fit border-2 p-4 rounded-md mb-2 "
                  >
                    {user}
                  </button>
                </li>
              ))
            : null}
        </ul>
      </div>
    </section>
  );
};
