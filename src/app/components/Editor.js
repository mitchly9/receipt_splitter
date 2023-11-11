import { useEffect, useState } from "react";
import {
  axiosPatch,
  deleteEntry,
  moveBranch,
  addOrEditSingleEntry,
  axiosPut,
} from "../api/apiCalls";
import { userReceiptSchema } from "../util/schemas";

export const Editor = ({ users, usersPaying, receiptName, setChange }) => {
  const [updateUsersPaying, setUpdateUsersPaying] = useState(usersPaying);

  useEffect(() => {}, [updateUsersPaying]);

  function changeDescription() {
    addOrEditSingleEntry(
      `receipts/${receiptName}`,
      "description",
      document.getElementById("changeDescription " + receiptName).value
    )
      .then(() => {
        setChange((prevChange) => prevChange + 1);
        document.getElementById("changeDescription " + receiptName).value = "";
      })
      .catch((error) => console.log(error));
  }

  function changePayTo() {
    addOrEditSingleEntry(
      `receipts/${receiptName}`,
      "payTo",
      document.getElementById("changePayTo " + receiptName).value
    )
      .then(() => {
        setChange((prevChange) => prevChange + 1);
        document.getElementById("changePayTo " + receiptName).value = "";
      })
      .catch((error) => console.log(error));
  }

  function changeReceiptName() {
    let newReceiptName = document.getElementById(
      "changeReceiptName " + receiptName
    ).value;
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
    addOrEditSingleEntry(
      `receipts/${receiptName}`,
      "total",
      document.getElementById("changeTotal " + receiptName).value
    )
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function addUserToReceipt(name) {
    Promise.all([
      addOrEditSingleEntry(`receipts/${receiptName}/individualTotals`, name, 0),
      addOrEditSingleEntry(`receipts/${receiptName}/marked`, name, false),
      addOrEditSingleEntry(
        `users/${name}/receipts`,
        receiptName,
        userReceiptSchema
      ),
    ])
      .then(() => {
        let updateUsersPayingCopy = [...updateUsersPaying];
        updateUsersPayingCopy.push(name);
        setUpdateUsersPaying(updateUsersPayingCopy);
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => {
        console.log("errors in here");
      });
  }

  function changeUsersPaying(e) {
    let name = e.target.textContent;
    if (updateUsersPaying.includes(name)) {
      Promise.all([
        deleteEntry(`receipts/${receiptName}/individualTotals`, name),
        deleteEntry(`receipts/${receiptName}/marked`, name),
        deleteEntry(`users/${name}/receipts`, receiptName),
      ]).then(() => {
        let update = [...updateUsersPaying];
        const index = update.indexOf(name);
        if (index > -1) {
          update.splice(index, 1);
        }
        setUpdateUsersPaying(update);
        setChange((prevChange) => prevChange + 1);
      });
    } else {
      addUserToReceipt(name);
    }
  }

  return (
    <section className="flex rounded-md border-2 flex-wrap justify-evenly bg-lightBackground text-darkFont">
      <div className="flex justify-center text-center">
        <div>
          <input
            type="text"
            id={"changeReceiptName " + receiptName}
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
            id={"changeTotal " + receiptName}
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
                key={`${user} editor ${receiptName}`}
                onClick={changeUsersPaying}
                className={
                  updateUsersPaying.includes(user)
                    ? "border-2 border-trueColor h-fit p-1 mx-2 mb-1"
                    : "border-2 border-falseColor h-fit p-1 mx-2 mb-1"
                }
              >
                <h1>{user}</h1>
              </button>
            ))
          : null}
        <form className="text-center">
          <input
            type="text"
            id={"addNameForm " + receiptName}
            className="border rounded w-min p-2 text-darkFont"
            placeholder="Enter new person"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              addUserToReceipt(
                document.getElementById("addNameForm " + receiptName).value
              );
              document.getElementById("addNameForm " + receiptName).value = "";
            }}
            className="block text-center w-full"
          >
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
            placeholder={"Enter Description " + receiptName}
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
            id={"changePayTo " + receiptName}
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
