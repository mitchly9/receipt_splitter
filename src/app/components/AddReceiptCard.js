import { receiptSchema, userReceiptSchema } from "../util/schemas";
import { useState, React } from "react";
import { addOrEditSingleEntry, axiosPut } from "../api/apiCalls";

const AddReceiptCard = ({ users, setChange }) => {
  const [usersAdded, setUsersAdded] = useState([]);

  ["Aidan", "Andoni", "Justin", "Mitchell"];
  function addUser(user) {
    if (usersAdded.includes(user)) {
      setUsersAdded(usersAdded.filter((addedUser) => addedUser !== user));
    } else {
      setUsersAdded([...usersAdded, user]);
    }
  }

  function addReceipt() {
    const receiptName = document.getElementById("newReceiptName").value;
    if (receiptName !== "") {
      let newReceiptData = { ...receiptSchema };
      const description = document.getElementById("newDescription").value;
      const payTo = document.getElementById("newPayTo").value;
      const total = document.getElementById("newChangeTotal").value;

      const individualTotals = {};
      const marked = {};
      let promises = [];
      for (const name of usersAdded) {
        individualTotals[name] = 0;
        marked[name] = false;
        promises.push(
          addOrEditSingleEntry(
            `users/${name}/receipts`,
            receiptName,
            userReceiptSchema
          )
        );
      }

      newReceiptData.description = description;
      newReceiptData.payTo = payTo;
      newReceiptData.total = total;
      newReceiptData.individualTotals = individualTotals;
      newReceiptData.marked = marked;

      document.getElementById("newReceiptName").value = "";
      document.getElementById("newDescription").value = "";
      document.getElementById("newPayTo").value = "";
      document.getElementById("newChangeTotal").value = "";

      Promise.all(promises, axiosPut(`receipts/${receiptName}`, newReceiptData))
        .then(() => {
          setChange((prevChange) => prevChange + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Name cannot be empty");
    }
  }

  return (
    <div className="pt-[10px] px-[3px] mb-[30px] text-center bg-lightBackground w-full rounded-md  text-darkFont">
      <div className="flex justify-center text-accent content-center">
        <input
          type="text"
          id={"newReceiptName"}
          className="rounded text-center border-2 bg-lightBackground border-lightBackground block p-2 w-1/3"
          placeholder={"Enter Receipt Name"}
        />
      </div>
      <div className="flex justify-center text-accent  content-center mt-3">
        <input
          type="text"
          id={"newChangeTotal"}
          className="text-center rounded border-2 bg-lightBackground border-lightBackground block p-2 text-darkFont w-min"
          placeholder={"Enter Total"}
        />
      </div>
      <ul className="flex justify-evenly flex-wrap text-center">
        {users
          ? users.map((user) => (
              <button
                key={`${user} Receipt Adder`}
                onClick={() => addUser(user)}
                className={
                  (usersAdded.includes(user)
                    ? "border-2 border-trueColor mx-2 mb-1"
                    : "border-2 border-falseColor  mx-2 mb-1") +
                  "text-text w-fit p-4 rounded-md mt-2"
                }
              >
                <h1>{user}</h1>
              </button>
            ))
          : null}
      </ul>
      <div className="flex justify-between text-accent text-text mt-1">
        <div className="flex justify-center text-center">
          <input
            type="text"
            id={"newDescription"}
            className="border-2 bg-lightBackground border-lightBackground rounded w-fit block p-2 text-darkFont"
            placeholder={"Enter Description"}
          />
        </div>
        <button
          className="border-2 ml-1 p-4  border-lightBackground rounded-md mt-1 text-trueColor"
          onClick={addReceipt}
        >
          Add
        </button>
        <div className="flex justify-center text-center">
          <input
            type="text"
            id={"newPayTo"}
            className="text-end border-2 bg-lightBackground border-lightBackground rounded w-fit block p-2 text-darkFont"
            placeholder={"Enter Pay To"}
          />
        </div>
      </div>
    </div>
  );
};

export default AddReceiptCard;
