"use client";
import { ReceiptCard } from "./components/ReceiptCard";
import { useState, React, useEffect } from "react";
import { UserList } from "./components/UserList";
import { OverviewReceiptCard } from "./components/OverviewReceiptCard";
import Image from "next/image";
import { Editor } from "./components/Editor";
import AddReceiptPopUp from "./components/AddReceiptPopUp";
import { addOrEditSingleEntry, axiosGet } from "./api/apiCalls";
import ItemCard from "./components/ItemCard";

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

  useEffect(() => {
    axiosGet("users")
      .then((userDataObj) => {
        setUsers(Object.keys(userDataObj.data));
      })
      .catch((error) => {
        console.log(error);
      });

    axiosGet("receipts")
      .then((allReceiptsObj) => {
        setAllReceiptsData(allReceiptsObj.data);
        setAllReceipts(Object.keys(allReceiptsObj.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [change]);

  useEffect(() => {
    axiosGet("receipts")
      .then((allReceiptsObj) => {
        setAllReceiptsData(allReceiptsObj.data);
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
      axiosGet(`users/${selectedUser}/receipts`)
        .then((personReceiptObj) => {
          setReceipts(Object.keys(personReceiptObj.data));
          setPersonReceiptsData(personReceiptObj.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedUser]);

  function calculateTotal() {
    axiosGet(`/receipts/${selectedReceipt}`)
      .then((receiptData) => {
        let allItems = receiptData.data.items;
        let allTotals = {};
        let actualTotal = 0;
        let usersPayingTotal = 0;
        Object.keys(receiptData.data.individualTotals).forEach(function (name) {
          allTotals[name] = 0;
        });
        for (let i = 0; i < allItems.length; i++) {
          actualTotal += allItems[i].itemPrice;
          if ("usersBuying" in allItems[i]) {
            let usersBuyingItem = Object.keys(allItems[i].usersBuying);
            for (let j = 0; j < usersBuyingItem.length; j++) {
              let math = allItems[i].itemPrice / usersBuyingItem.length;
              usersPayingTotal += math;
              allTotals[usersBuyingItem[j]] += math;
            }
          }
        }
        Object.keys(receiptData.data.individualTotals).forEach(function (name) {
          allTotals[name] = Math.round(allTotals[name] * 100) / 100;
        });
        usersPayingTotal = Math.round(usersPayingTotal * 100) / 100;
        addOrEditSingleEntry(
          `/receipts/${selectedReceipt}`,
          "actualTotal",
          actualTotal
        );
        addOrEditSingleEntry(
          `/receipts/${selectedReceipt}`,
          "usersPayingTotal",
          usersPayingTotal
        );
        addOrEditSingleEntry(
          `/receipts/${selectedReceipt}`,
          "individualTotals",
          allTotals
        );
        Object.keys(receiptData.data.individualTotals).forEach(function (name) {
          addOrEditSingleEntry(
            `/users/${name}/receipts/${selectedReceipt}`,
            "individualTotal",
            allTotals[name]
          );
        });
      })
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function switchToReceipt(receiptName) {
    setSelectedReceipt(receiptName);
    document.getElementById("receipt-chooser").classList.add("hidden");
    document.getElementById("select-items").style.display = "";
    setUsers(
      Object.keys(
        "individualTotals" in allReceiptsData[receiptName]
          ? allReceiptsData[receiptName].individualTotals
          : []
      )
    );
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
    <main className="bg-darkBackground max-h-fit min-h-screen p-10 text-lightFont">
      <header className="flex justify-center items-center">
        {selectedReceipt === "" ? null : (
          <button onClick={switchToUser} className="absolute left-5">
            {/* <Image
              src={
                "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Back_Arrow.svg/2048px-Back_Arrow.svg.png"
              }
              width={50}
              height={50}
              alt={"Back Button"}
            /> */}
          </button>
        )}
        <UserList
          setChange={setChange}
          setSelectedReceipt={setSelectedReceipt}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </header>
      <article id={"receipt-chooser"} className="mt-12">
        {selectedUser === "Overview"
          ? allReceipts && allReceiptsData
            ? allReceipts.map((receiptName) =>
                receiptName in allReceiptsData ? (
                  <div key={`${receiptName} overview`}>
                    {admin ? (
                      <Editor
                        receiptName={receiptName}
                        users={users}
                        usersPaying={Object.keys(
                          receiptName in allReceiptsData &&
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
                      marked={
                        "marked" in allReceiptsData[receiptName]
                          ? allReceiptsData[receiptName].marked
                          : []
                      }
                      switchToReceipt={switchToReceipt}
                      setSelectedUser={setSelectedUser}
                      individualTotals={
                        allReceiptsData[receiptName].individualTotals
                      }
                    />
                  </div>
                ) : null
              )
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
                <ReceiptCard
                  selectedUser={selectedUser}
                  receiptName={receiptName}
                  total={allReceiptsData[receiptName].total}
                  individualTotal={
                    personReceiptsData[receiptName].individualTotal
                  }
                  switchToReceipt={switchToReceipt}
                  description={allReceiptsData[receiptName].description}
                  payTo={allReceiptsData[receiptName].payTo}
                  marked={personReceiptsData[receiptName].marked}
                  paid={personReceiptsData[receiptName].paid}
                  setChange={setChange}
                />
                {/* </button> */}
              </div>
            ))
          : null}

        {/* Admin Stuff*/}
        <AddReceiptPopUp
          setChange={setChange}
          allReceiptsData={allReceiptsData}
        />

        {selectedUser === "Overview" ? (
          admin ? (
            <div className="flex justify-between">
              <button onClick={openUserBox}>Add Receipt</button>
              <button
                onClick={() => {
                  setAdmin((prevAdmin) => !prevAdmin);
                }}
              >
                Disable Admin
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setAdmin((prevAdmin) => !prevAdmin);
                }}
              >
                Enable Admin
              </button>
            </div>
          )
        ) : null}
      </article>

      <article id={"select-items"} style={{ display: "none" }}>
        {selectedReceipt !== "" &&
        allReceiptsData &&
        "items" in allReceiptsData[selectedReceipt] ? (
          <div>
            <div className="flex justify-center mt-5">
              <button
                onClick={() => {
                  setAdmin((prevAdmin) => !prevAdmin);
                }}
                className="text-center"
              >
                {admin ? "Disable Admin" : "Enable Admin"}
              </button>
            </div>
            <button
              onClick={calculateTotal}
              className="mt-5 text-center w-full bg-lightBackground rounded-md p-4"
            >
              Calculate Total
              <div>
                {"individualTotals" in allReceiptsData[selectedReceipt] &&
                selectedReceipt !== "" ? (
                  <span className="text-accent">
                    $
                    {allReceiptsData[selectedReceipt].individualTotals[
                      selectedUser
                    ].toFixed(2)}
                  </span>
                ) : (
                  <span className="text-accent">$0.00</span>
                )}
                <div className="flex justify-center">
                  <h3 className="border-t-2">
                    ${allReceiptsData[selectedReceipt].total}
                  </h3>
                </div>
              </div>
              {admin ? (
                <div>
                  Users Paying vs Actual Total
                  <div className="text-accent">
                    ${allReceiptsData[selectedReceipt].usersPayingTotal}
                  </div>
                  <div className="border-t-2">
                    ${allReceiptsData[selectedReceipt].actualTotal}
                  </div>
                </div>
              ) : null}
            </button>
            <div className="flex flex-col items-center">
              <div className="mt-5 grid-cols-3 grid gap-5 flex-wrap">
                {admin ? (
                  <button> add Item</button>
                ) : (
                  <button> Dont add </button>
                )}
                {allReceiptsData[selectedReceipt].items.map((item, index) => (
                  <ItemCard
                    item={item}
                    key={item.itemName + index}
                    index={index}
                    selectedReceipt={selectedReceipt}
                    selectedUser={selectedUser}
                    setChange={setChange}
                    usersPaying={Object.keys(
                      "individualTotals" in allReceiptsData[selectedReceipt] &&
                        selectedReceipt !== ""
                        ? allReceiptsData[selectedReceipt].individualTotals
                        : []
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div> No Items </div>
        )}
      </article>
      {selectedUser === "Mitchell" ? (
        <div className="flex justify-center"></div>
      ) : null}
    </main>
  );
};

export default LandingPage;
