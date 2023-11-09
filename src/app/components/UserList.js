import React from "react";
import { useEffect, useState } from "react";

export const UserList = ({ selectedUser, setSelectedUser, users }) => {
  function changeUser() {
    document.getElementById("name-header").classList.add("hidden");
    document.getElementById("user-list").style.display = "";
  }

  function selectUser(e) {
    document.getElementById("name-header").classList.remove("hidden");
    document.getElementById("user-list").style.display = "none";
    setSelectedUser(e.target.textContent);
  }

  return (
    <section id="header" className="flex justify-center">
      <h1
        id={"name-header"}
        onClick={changeUser}
        className="text-title w-fit border-2 p-4 rounded-md"
      >
        {selectedUser}
      </h1>
      <div id={"user-list"} className="w-screen" style={{ display: "none" }}>
        <ul className="flex flex-wrap justify-around">
          <h1
            onClick={(e) => {
              selectUser(e);
            }}
            className="text-title w-fit border-2 p-4 rounded-md mb-2 "
          >
            Overview
          </h1>
          {users
            ? users.map((user) => (
                <li key={`${user} list`}>
                  <h1
                    onClick={(e) => {
                      selectUser(e);
                    }}
                    className="text-title w-fit border-2 p-4 rounded-md mb-2 "
                  >
                    {user}
                  </h1>
                </li>
              ))
            : null}
        </ul>
      </div>
    </section>
  );
};
