"use client";
import { ReceiptCard } from "./components/ReceiptCard";
import axios from "axios";
import { useState, React, useEffect } from "react";
import { UserList } from "./components/UserList";
import { OverviewReceiptCard } from "./components/OverviewReceiptCard";
import Image from "next/image";
import { Editor } from "./components/Editor";
import AddReceiptPopUp from "./components/AddReceiptPopUp";

const LandingPage = () => {
  const [users, setUsers] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [personReceiptsData, setPersonReceiptsData] = useState([]);
  const [allReceiptsData, setAllReceiptsData] = useState([]);
  const [allReceipts, setAllReceipts] = useState([]);
  const [selectedUser, setSelectedUser] = useState("Overview");
  const [selectedReceipt, setSelectedReceipt] = useState("");
  const [change, setChange] = useState(0);
  const [admin, setAdmin] = useState(false);

  function axiosGet(url) {
    return axios
      .get(`https://groceryapp-5e433-default-rtdb.firebaseio.com/${url}.json`)
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    axiosGet("users")
      .then((userDataObj) => userDataObj.data)
      .then((userData) => {
        setUsers(Object.keys(userData));
      })
      .catch((error) => {
        console.log(error);
      });
    // axios
    //   .get("https://groceryapp-5e433-default-rtdb.firebaseio.com/users.json")
    //   .then((response) => {
    //     setUsers(Object.keys(response.data));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    axios
      .get("https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts.json")
      .then((response) => {
        setAllReceiptsData(response.data);
        setAllReceipts(Object.keys(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [change]);

  useEffect(() => {
    axios
      .get("https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts.json")
      .then((response) => {
        setAllReceiptsData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [allReceipts]);

  useEffect(() => {
    if (selectedUser === "Overview") {
      document.getElementById("receipt-chooser").classList.remove("hidden");
      document.getElementById("select-items").style.display = "none";
      setSelectedReceipt("");
      setReceipts([]);
    } else {
      axios
        .get(
          `https://groceryapp-5e433-default-rtdb.firebaseio.com/users/${selectedUser}/receipts.json`
        )
        .then((response) => {
          setReceipts(Object.keys(response.data));
          setPersonReceiptsData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedUser]);

  function switchToReceipt(receiptName) {
    document.getElementById("receipt-chooser").classList.add("hidden");
    document.getElementById("select-items").style.display = "";
    setSelectedReceipt(receiptName);
  }

  function openUserBox() {
    document.getElementById("add-receipt").style.display = "";
  }

  function switchToUser() {
    document.getElementById("receipt-chooser").classList.remove("hidden");
    document.getElementById("select-items").style.display = "none";
    setSelectedReceipt("");
  }

  return (
    <main className="bg-darkBackground max-h-fit min-h-screen pt-10 text-lightFont">
      <header className="flex justify-center items-center">
        {selectedReceipt === "" ? null : (
          <button onClick={switchToUser} className="absolute left-5">
            <Image
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Back_Arrow.svg/2048px-Back_Arrow.svg.png"
              }
              width={50}
              height={50}
              alt={"Back Button"}
            />
          </button>
        )}
        <UserList
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </header>
      <article id={"receipt-chooser"} className="w-screen p-12">
        {selectedUser === "Overview"
          ? allReceipts && allReceiptsData
            ? allReceipts.map((receiptName) => (
                <div key={`${receiptName} overview`}>
                  {admin ? (
                    <Editor
                      receiptName={receiptName}
                      users={users}
                      usersPaying={Object.keys(
                        "individualTotals" in allReceiptsData[receiptName]
                          ? allReceiptsData[receiptName].individualTotals
                          : []
                      )}
                      setChange={setChange}
                      change={change}
                    />
                  ) : null}
                  <OverviewReceiptCard
                    receiptName={receiptName}
                    total={allReceiptsData[receiptName].total}
                    description={allReceiptsData[receiptName].description}
                    payTo={allReceiptsData[receiptName].payTo}
                    users={Object.keys(
                      "individualTotals" in allReceiptsData[receiptName]
                        ? allReceiptsData[receiptName].individualTotals
                        : []
                    )}
                    switchToReceipt={switchToReceipt}
                    setSelectedUser={setSelectedUser}
                    individualTotals={
                      allReceiptsData[receiptName].individualTotals
                    }
                  />
                </div>
              ))
            : null
          : receipts && allReceiptsData
          ? receipts.map((receiptName) => (
              <div key={`${receiptName} receiptcard`}>
                {admin && receiptName in allReceipts ? (
                  <Editor
                    receiptName={receiptName}
                    users={users}
                    usersPaying={Object.keys(
                      "individualTotals" in allReceiptsData[receiptName]
                        ? allReceiptsData[receiptName].individualTotals
                        : []
                    )}
                    setChange={setChange}
                  />
                ) : null}
                <button
                  className="w-full mb-[30px]"
                  onClick={() => {
                    switchToReceipt(receiptName);
                  }}
                >
                  {allReceipts[receiptName] ? (
                    <ReceiptCard
                      receiptName={receiptName}
                      total={allReceiptsData[receiptName].total}
                      individualTotal={
                        personReceiptsData[receiptName].individualTotal
                      }
                      description={allReceiptsData[receiptName].description}
                      payTo={allReceiptsData[receiptName].payTo}
                    />
                  ) : null}
                </button>
              </div>
            ))
          : null}

        {/* Admin Stuff*/}
        <AddReceiptPopUp setChange={setChange} />

        {selectedUser === "Mitchell" ? (
          admin ? (
            <div className="flex justify-between">
              <button onClick={openUserBox}>Add Receipt</button>
              <button
                onClick={() => {
                  setAdmin((prevAdmin) => !prevAdmin);
                }}
              >
                Disable Edits
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setAdmin((prevAdmin) => !prevAdmin);
                }}
              >
                Enable Edits
              </button>
            </div>
          )
        ) : null}
      </article>

      <article id={"select-items"} style={{ display: "none" }}>
        Next Screen for {selectedUser} for {selectedReceipt}
      </article>
      {selectedUser === "Mitchell" ? (
        <div className="flex justify-center">
          {/* <button onClick={openUserBox}>Add Items</button> */}
        </div>
      ) : null}
    </main>
  );
};

export default LandingPage;
