import axios from "axios";
import { useEffect, useState } from "react";

export const Editor = ({ users, usersPaying, receiptName, setChange }) => {
  const [updateUsersPaying, setUpdateUsersPaying] = useState(usersPaying);

  useEffect(() => {}, [updateUsersPaying]);

  function changeDescription() {
    let description = document.getElementById("changeDescription").value;
    let data = { description: description };
    axios
      .patch(
        `https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts/${receiptName}.json`,
        data
      )
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function changePayTo() {
    let payTo = document.getElementById("changePayTo").value;
    let data = { payTo: payTo };
    axios
      .patch(
        `https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts/${receiptName}.json`,
        data
      )
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function changeReceiptName() {
    let newReceiptName = document.getElementById("changeReceiptName").value;
    axios
      .get(
        `https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts/${receiptName}.json`
      )
      .then((receipt) => {
        axios
          .put(
            `https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts/${receiptName}.json`,
            {
              description: null,
              individualTotals: null,
              payTo: null,
              total: null,
            }
          )
          .then(() => {
            axios
              .put(
                `https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts/${newReceiptName}.json`,
                receipt.data
              )
              .then(() => {
                for (let i = 0; i < updateUsersPaying.length; i++) {
                  axios
                    .get(
                      `https://groceryapp-5e433-default-rtdb.firebaseio.com/users/${updateUsersPaying[i]}/receipts/${receiptName}.json`
                    )
                    .then((userReceipt) => {
                      axios
                        .put(
                          `https://groceryapp-5e433-default-rtdb.firebaseio.com/users/${updateUsersPaying[i]}/receipts/${receiptName}.json`,
                          {
                            individualTotal: null,
                            marked: null,
                            paid: null,
                          }
                        )
                        .then(() => {
                          axios.put(
                            `https://groceryapp-5e433-default-rtdb.firebaseio.com/users/${updateUsersPaying[i]}/receipts/${newReceiptName}.json`,
                            userReceipt.data
                          );
                        });
                    })
                    .catch((error) => console.log(error));
                }
              })
              .then(() => {
                setChange((prevChange) => prevChange + 1);
              })
              .catch((error) => console.log(error));
          })
          .catch((error) => console.log("null"));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function changeTotal() {
    let newTotal = document.getElementById("changeTotal").value;
    let newObjTotal = { total: newTotal };
    axios
      .patch(
        `https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts/${receiptName}.json`,
        newObjTotal
      )
      .then(() => {
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function addUserReceiptAndTotals(name) {
    let addUsersPaying = {};
    addUsersPaying[name] = 0;
    axios
      .patch(
        `https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts/${receiptName}/individualTotals.json`,
        addUsersPaying
      )
      .then(() => {
        let newArr = [...updateUsersPaying];
        newArr.push(name);

        let addUserReceipt = {};
        addUserReceipt[receiptName] = {
          individualTotal: 0,
          marked: false,
          paid: false,
        };
        axios
          .patch(
            `https://groceryapp-5e433-default-rtdb.firebaseio.com/users/${name}/receipts.json`,
            addUserReceipt
          )
          .then(() => {
            setUpdateUsersPaying(newArr);
            setChange((prevChange) => prevChange + 1);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function changeUsersPaying(e) {
    let name = e.target.textContent;
    if (updateUsersPaying.includes(name)) {
      let deleteUsersPaying = {};
      deleteUsersPaying[name] = null;
      axios
        .patch(
          `https://groceryapp-5e433-default-rtdb.firebaseio.com/receipts/${receiptName}/individualTotals.json`,
          deleteUsersPaying
        )
        .then(() => {
          let newArr = [...updateUsersPaying];
          const index = newArr.indexOf(name);

          if (index > -1) {
            // only splice array when item is found
            newArr.splice(index, 1); // 2nd parameter means remove one item only
          }
          let deleteUserReceipt = {};
          deleteUserReceipt[receiptName] = null;
          axios
            .patch(
              `https://groceryapp-5e433-default-rtdb.firebaseio.com/users/${name}/receipts.json`,
              deleteUserReceipt
            )
            .then(() => {
              setUpdateUsersPaying(newArr);
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
