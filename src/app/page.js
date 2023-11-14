"use client";
import { ReceiptCard } from "./components/ReceiptCard";
import { useState, React, useEffect } from "react";
import { UserList } from "./components/UserList";
import { OverviewReceiptCard } from "./components/OverviewReceiptCard";
import { ReceiptEditor } from "./components/ReceiptEditor";
import { addOrEditSingleEntry, axiosGet } from "./api/apiCalls";
import ItemCard from "./components/ItemCard";
import ItemEditor from "./components/ItemEditor";
import AddReceiptCard from "./components/AddReceiptCard";
import ItemAdder from "./components/ItemAdder";

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
    if (selectedUser !== "Overview" && selectedReceipt != "") {
      setUsers(
        Object.keys(
          "individualTotals" in allReceiptsData[selectedReceipt]
            ? allReceiptsData[selectedReceipt].individualTotals
            : []
        )
      );
    } else {
      axiosGet("users")
        .then((userDataObj) => {
          setUsers(Object.keys(userDataObj.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }
    axiosGet("receipts")
      .then((allReceiptsObj) => {
        setAllReceiptsData(allReceiptsObj.data);
        setAllReceipts(
          "data" in allReceiptsObj ? Object.keys(allReceiptsObj.data) : null
        );
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
        let itemIDs = Object.keys(allItems);
        for (let i = 0; i < itemIDs.length; i++) {
          actualTotal += parseFloat(
            Math.round(allItems[itemIDs[i]].itemPrice * 100) / 100
          );
          if ("usersBuying" in allItems[itemIDs[i]]) {
            let usersBuyingItem = Object.keys(allItems[itemIDs[i]].usersBuying);
            for (let j = 0; j < usersBuyingItem.length; j++) {
              let math = parseFloat(
                parseFloat(allItems[itemIDs[i]].itemPrice) /
                  usersBuyingItem.length
              );
              usersPayingTotal += parseFloat(math);
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
          actualTotal.toFixed(2)
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

  return (
    <main className="bg-darkBackground max-h-fit min-h-screen p-10 text-lightFont">
      <header className="flex">
        <UserList
          admin={admin}
          setAdmin={setAdmin}
          setChange={setChange}
          setSelectedReceipt={setSelectedReceipt}
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          selectedReceipt={selectedReceipt}
        />
      </header>
      <article id={"receipt-chooser"} className="mt-12">
        {selectedUser === "Overview" ? (
          <div>
            {admin ? (
              <AddReceiptCard users={users} setChange={setChange} />
            ) : null}
            {allReceipts.map((receiptName) =>
              receiptName in allReceiptsData ? (
                <div key={`${receiptName} overview`}>
                  {admin ? (
                    <ReceiptEditor
                      receiptName={receiptName}
                      users={users}
                      usersPaying={Object.keys(
                        receiptName in allReceiptsData &&
                          "individualTotals" in allReceiptsData[receiptName]
                          ? allReceiptsData[receiptName].individualTotals
                          : []
                      )}
                      allReceiptsData={
                        receiptName in allReceiptsData
                          ? allReceiptsData[receiptName]
                          : []
                      }
                      setChange={setChange}
                    />
                  ) : (
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
                  )}
                </div>
              ) : null
            )}
          </div>
        ) : receipts && allReceiptsData ? (
          receipts.map((receiptName) => (
            <div key={`${receiptName} receiptcard`}>
              {admin ? (
                <ReceiptEditor
                  receiptName={receiptName}
                  users={users}
                  usersPaying={Object.keys(
                    receiptName in allReceiptsData &&
                      "individualTotals" in allReceiptsData[receiptName]
                      ? allReceiptsData[receiptName].individualTotals
                      : []
                  )}
                  allReceiptsData={
                    receiptName in allReceiptsData
                      ? allReceiptsData[receiptName]
                      : []
                  }
                  setChange={setChange}
                />
              ) : (
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
              )}
            </div>
          ))
        ) : null}
        {selectedUser === "Overview" ? (
          <div className="flex justify-center">
            <button
              onClick={() => {
                setAdmin((prevAdmin) => !prevAdmin);
              }}
            >
              {admin ? "Disable Admin" : "Enable Admin"}
            </button>
          </div>
        ) : null}
      </article>
      <article id={"select-items"} style={{ display: "none" }}>
        {selectedReceipt !== "" &&
        allReceiptsData &&
        "items" in allReceiptsData[selectedReceipt] ? (
          <div>
            <div className="mt-5 grid-cols-3 grid gap-5 flex-wrap">
              <button
                onClick={calculateTotal}
                className=" bg-lightBackground p-3 break-all"
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
                      $
                      {parseFloat(
                        allReceiptsData[selectedReceipt].total
                      ).toFixed(2)}
                    </h3>
                  </div>
                </div>
                {admin ? (
                  <div>
                    Users Paying vs Actual Total
                    <div className="flex justify-center">
                      <div>
                        <span className="text-accent">
                          ${allReceiptsData[selectedReceipt].usersPayingTotal}
                        </span>
                        <div className="border-t-2">
                          ${allReceiptsData[selectedReceipt].actualTotal}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </button>
              {Object.keys(allReceiptsData[selectedReceipt].items).map(
                (itemID) =>
                  admin ? (
                    <ItemEditor
                      item={allReceiptsData[selectedReceipt].items[itemID]}
                      itemID={itemID}
                      key={
                        allReceiptsData[selectedReceipt].items[itemID] + itemID
                      }
                      selectedReceipt={selectedReceipt}
                      selectedUser={selectedUser}
                      setChange={setChange}
                      usersPaying={Object.keys(
                        "individualTotals" in
                          allReceiptsData[selectedReceipt] &&
                          selectedReceipt !== ""
                          ? allReceiptsData[selectedReceipt].individualTotals
                          : []
                      )}
                    />
                  ) : (
                    <ItemCard
                      item={allReceiptsData[selectedReceipt].items[itemID]}
                      itemID={itemID}
                      key={
                        allReceiptsData[selectedReceipt].items[itemID] + itemID
                      }
                      selectedReceipt={selectedReceipt}
                      selectedUser={selectedUser}
                      setChange={setChange}
                      usersPaying={Object.keys(
                        "individualTotals" in
                          allReceiptsData[selectedReceipt] &&
                          selectedReceipt !== ""
                          ? allReceiptsData[selectedReceipt].individualTotals
                          : []
                      )}
                    />
                  )
              )}
            </div>
          </div>
        ) : (
          <div> No Items </div>
        )}
        <ItemAdder
          admin={admin}
          selectedReceipt={selectedReceipt}
          setChange={setChange}
        />
      </article>

      {selectedUser === "Mitchell" ? (
        <div className="flex justify-center"></div>
      ) : null}
    </main>
  );
};

export default LandingPage;
