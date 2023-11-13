import React from "react";

export const UserList = ({
  selectedUser,
  setSelectedUser,
  users,
  setSelectedReceipt,
  setChange,
  selectedReceipt,
  admin,
  setAdmin,
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

  function goBackToUser() {
    document.getElementById("receipt-chooser").classList.remove("hidden");
    document.getElementById("select-items").style.display = "none";
    setSelectedReceipt("");
    setChange((prevChange) => prevChange + 1);
  }
  return (
    <section
      id="header"
      className="text-center flex-col flex justify-center items-center w-full"
    >
      {selectedReceipt !== "" ? (
        <div className="grid grid-cols-5 w-full">
          {selectedUser === "Mitchell" ? (
            <div className="col-start-1 flex justify-start">
              <button
                className="border-2 rounded-md w-fit h-fit p-1"
                onClick={() => {
                  setAdmin((prevAdmin) => !prevAdmin);
                }}
              >
                {admin ? "Disable Admin" : "Enable Admin"}
              </button>
            </div>
          ) : null}

          <div className="col-start-2 col-end-5 w-full ">
            <div>
              <h1 className="text-title font-bold text-accent">
                {selectedReceipt}
              </h1>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className={"border-2 p-1 rounded-md w-fit h-fit "}
              onClick={goBackToUser}
            >
              Back to {selectedUser}
            </button>
          </div>
        </div>
      ) : null}
      <button
        id={"name-header"}
        onClick={changeUser}
        className="text-title font-medium w-fit border-2 p-4 rounded-md text-center flex justify-center"
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
