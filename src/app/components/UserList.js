import React from "react";

export const UserList = ({
  selectedUser,
  setSelectedUser,
  users,
  setSelectedReceipt,
  setChange,
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
    <section id="header" className="flex justify-center">
      <button
        id={"name-header"}
        onClick={changeUser}
        className="text-title w-fit border-2 p-4 rounded-md"
      >
        {selectedUser}
      </button>
      <div id={"user-list"} className="w-screen" style={{ display: "none" }}>
        <ul className="flex flex-wrap justify-around">
          <button
            onClick={(e) => {
              selectUser(e);
            }}
            className="text-title w-fit border-2 p-4 rounded-md mb-2 "
          >
            Overview
          </button>
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
