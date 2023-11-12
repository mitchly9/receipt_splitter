import { useEffect, useState } from "react";
import {
  deleteBranch,
  deleteEntry,
  moveBranch,
  addOrEditSingleEntry,
} from "../api/apiCalls";
import { userReceiptSchema } from "../util/schemas";

export const ReceiptEditor = ({
  users,
  usersPaying,
  receiptName,
  setChange,
  allReceiptsData,
}) => {
  const [updateUsersPaying, setUpdateUsersPaying] = useState(usersPaying);

  function deleteReceipt() {
    if ("individualTotals" in allReceiptsData) {
      let promises = [];
      const usersBuying = Object.keys(allReceiptsData.individualTotals);
      for (let i = 0; i < usersBuying.length; i++) {
        promises.push(
          deleteBranch(`users/${usersBuying[i]}/receipts/${receiptName}`)
        );
      }
      Promise.all(promises)
        .then(() => {
          deleteBranch(`receipts/${receiptName}`).catch((error) =>
            console.log(error)
          );
        })
        .then(() => {
          document.getElementById("add-receipt").style.display = "none";
          setChange((prevChange) => prevChange + 1);
        })
        .catch((error) => console.log(error));
    } else {
      deleteBranch(`receipts/${receiptName}`)
        .then(() => {
          setChange((prevChange) => prevChange + 1);
        })
        .catch((error) => console.log(error));
    }
  }

  useEffect(() => {}, [updateUsersPaying]);

  function changeEntry(entry, value) {
    if (value !== "") {
      addOrEditSingleEntry(`receipts/${receiptName}`, entry, value)
        .then(() => {
          setChange((prevChange) => prevChange + 1);
        })
        .catch((error) => console.log(error));
    } else {
      alert(entry + " cannot be empty");
    }
  }

  function changeReceiptName() {
    let newReceiptName = document.getElementById(
      "changeReceiptName " + receiptName
    ).value;
    if (newReceiptName !== "") {
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
    } else {
      alert("Name can't be empty");
    }
  }

  function addUserToReceipt(name) {
    if (name !== "") {
      Promise.all([
        addOrEditSingleEntry(
          `receipts/${receiptName}/individualTotals`,
          name,
          0
        ),
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
          console.log(error);
        });
    } else {
      alert("Name cannot be empty");
    }
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
    <div
      key={receiptName}
      className="pt-[10px] px-[3px] mb-[30px] text-center bg-lightBackground w-full rounded-md  text-darkFont"
    >
      <div className="flex justify-center text-accent content-center">
        <input
          type="text"
          id={"changeReceiptName " + receiptName}
          className="rounded text-center border-2 bg-lightBackground border-lightBackground block p-2 w-1/3"
          placeholder={receiptName}
        />
        <button
          className="border-2 ml-1 p-4  border-lightBackground rounded-md mt-1"
          onClick={changeReceiptName}
        ></button>
      </div>
      <div className="flex justify-center text-accent  content-center mt-3">
        <input
          type="text"
          id={"changeTotal " + receiptName}
          className="text-center rounded border-2 bg-lightBackground border-lightBackground block p-2 text-darkFont w-min"
          placeholder={"$" + allReceiptsData.total}
        />
        <button
          className="border-2 border-lightBackground ml-1 p-4  self-center  rounded-md mt-1"
          onClick={() => {
            changeEntry(
              "total",
              document.getElementById("changeTotal " + receiptName).value
            );
            document.getElementById("changeTotal " + receiptName).value = "";
          }}
        ></button>
      </div>

      <ul className="flex justify-evenly flex-wrap text-center">
        {users
          ? users.map((user) => (
              <button
                key={`${user} editor ${receiptName}`}
                onClick={changeUsersPaying}
                className={
                  (updateUsersPaying.includes(user)
                    ? "border-2 border-trueColor mx-2 mb-1"
                    : "border-2 border-falseColor  mx-2 mb-1") +
                  "text-text w-fit p-4 rounded-md mt-2"
                }
              >
                <h1>{user}</h1>
              </button>
            ))
          : null}
        <form className="flex text-accent text-center">
          <input
            type="text"
            id={"addNameForm " + receiptName}
            className="text-center text-text border-2 bg-lightBackground border-lightBackground text-whitew-min  rounded-md mt-2"
            placeholder="Enter New person"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              addUserToReceipt(
                document.getElementById("addNameForm " + receiptName).value
              );
              document.getElementById("addNameForm " + receiptName).value = "";
            }}
            className="border-2 border-lightBackground ml-1 p-4  self-center  rounded-md mt-1"
          ></button>
        </form>
      </ul>
      <div className="flex justify-between text-accent text-text mt-1">
        <div className="flex justify-center text-center">
          <input
            type="text"
            id={"changeDescription " + receiptName}
            className="border border-2 bg-lightBackground border-lightBackground rounded w-fit block p-2 text-darkFont"
            placeholder={allReceiptsData.description}
          />
          <button
            className="border-2 border-lightBackground ml-1 p-4  self-center  rounded-md mt-1"
            onClick={() => {
              changeEntry(
                "description",
                document.getElementById("changeDescription " + receiptName)
                  .value
              );
              document.getElementById(
                "changeDescription " + receiptName
              ).value = "";
            }}
          ></button>
        </div>
        <div className="text-falseColor">
          <button
            className="border-2 ml-1 p-4  border-lightBackground rounded-md mt-1 text-falseColor"
            onClick={deleteReceipt}
          >
            Delete
          </button>
        </div>
        <div className="flex justify-center text-center">
          <input
            type="text"
            id={"changePayTo " + receiptName}
            className="text-end border-2 bg-lightBackground border-lightBackground rounded w-fit block p-2 text-darkFont"
            placeholder={allReceiptsData.payTo}
          />
          <button
            className="border-2 border-lightBackground ml-1 p-4  self-center  rounded-md mt-1"
            onClick={() => {
              changeEntry(
                "payTo",
                document.getElementById("changePayTo " + receiptName).value
              );
              document.getElementById("changePayTo " + receiptName).value = "";
            }}
          ></button>
        </div>
      </div>
    </div>
  );
};
