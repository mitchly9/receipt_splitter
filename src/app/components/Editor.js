import { useEffect, useState } from "react";
import { axiosPatch, deleteEntry, moveBranch } from "../api/apiCalls";

export const Editor = ({ users, usersPaying, receiptName, setChange }) => {
  const [updateUsersPaying, setUpdateUsersPaying] = useState(usersPaying);

  useEffect(() => {}, [updateUsersPaying]);

  function changeDescription() {
    let description = document.getElementById("changeDescription").value;
    let newDescriptionData = { description: description };
    axiosPatch(`receipts/${receiptName}`, newDescriptionData)
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function changePayTo() {
    let payTo = document.getElementById("changePayTo").value;
    let newPayToData = { payTo: payTo };
    axiosPatch(`receipts/${receiptName}`, newPayToData)
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function changeReceiptName() {
    let newReceiptName = document.getElementById("changeReceiptName").value;
    moveBranch(`receipts/${receiptName}`, `receipts/${newReceiptName}`)
      .then(() => {
        for (let i = 0; i < updateUsersPaying.length; i++) {
          moveBranch(
            `users/${updateUsersPaying[i]}/receipts/${receiptName}`,
            `users/${updateUsersPaying[i]}/receipts/${newReceiptName}`
          );
        }
      })
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function changeTotal() {
    let newTotal = document.getElementById("changeTotal").value;
    let newTotalData = { total: newTotal };
    axiosPatch(`receipts/${receiptName}`, newTotalData)
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function addUserReceiptAndTotals(name) {
    let usersPayingData = {};
    usersPayingData[name] = 0;
    axiosPatch(
      `receipts/${receiptName}/individualTotals`,
      usersPayingData
    ).catch((error) => {
      console.log(error);
    });

    let updateUsersPayingCopy = [...updateUsersPaying];
    updateUsersPayingCopy.push(name);

    let addUserReceipt = {};
    addUserReceipt[receiptName] = {
      individualTotal: 0,
      marked: false,
      paid: false,
    };

    axiosPatch(`users/${name}/receipts`, addUserReceipt).then(() => {
      setUpdateUsersPaying(updateUsersPayingCopy);
      setChange((prevChange) => prevChange + 1);
    });
  }

  function changeUsersPaying(e) {
    let name = e.target.textContent;
    if (updateUsersPaying.includes(name)) {
      deleteEntry(`receipts/${receiptName}/individualTotals`, name)
        .then(() => {
          deleteEntry(`users/${name}/receipts`, receiptName).then(() => {
            let update = [...updateUsersPaying];
            const index = update.indexOf(name);
            if (index > -1) {
              update.splice(index, 1);
            }
            setUpdateUsersPaying(update);
            setChange((prevChange) => prevChange + 1);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      addUserReceiptAndTotals(name);
    }
  }

  return (
    <section className="flex rounded-md border-2 flex-wrap justify-evenly bg-lightBackground text-darkFont">
      <div className="flex justify-center text-center">
        <div>
          <input
            type="text"
            id="changeReceiptName"
            className="border rounded w-min block p-2 text-darkFont"
            placeholder="Enter New Name"
          />
          <button className="border-2" onClick={changeReceiptName}>
            Change Receipt Name
          </button>
        </div>
      </div>
      <div className="flex justify-center text-center">
        <div>
          <input
            type="text"
            id="changeTotal"
            className="border rounded w-min block p-2 text-darkFont"
            placeholder="Enter New Total"
          />
          <button className="border-2" onClick={changeTotal}>
            Change Total
          </button>
        </div>
      </div>
      <ul className="flex justify-evenly flex-wrap text-center">
        {users
          ? users.map((user) => (
              <button
                key={`${user} editor`}
                onClick={changeUsersPaying}
                className={
                  updateUsersPaying.includes(user)
                    ? "border-2 border-green-300 h-fit p-1 mx-2 mb-1"
                    : "border-2 border-red-300 h-fit p-1 mx-2 mb-1"
                }
              >
                <h1>{user}</h1>
              </button>
            ))
          : null}
        <form className="text-center">
          <input
            type="text"
            id="addName"
            className="border rounded w-min p-2 text-darkFont"
            placeholder="Enter new person"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              addUserReceiptAndTotals(document.getElementById("addName").value);
              document.getElementById("addName").value = "";
            }}
            className="block text-center w-full"
          >
            {" "}
            Add
          </button>
        </form>
      </ul>
      <div className="flex justify-center text-center">
        <div>
          <input
            type="text"
            id="changeDescription"
            className="border rounded w-fit block p-2 text-darkFont"
            placeholder="Enter Description"
          />
          <button className="border-2" onClick={changeDescription}>
            Change Description
          </button>
        </div>
      </div>
      <div className="flex justify-center text-center">
        <div>
          <input
            type="text"
            id="changePayTo"
            className="border rounded w-fit block p-2 text-darkFont"
            placeholder="Enter Name"
          />
          <button className="border-2" onClick={changePayTo}>
            Change Pay To
          </button>
        </div>
      </div>
    </section>
  );
};
