import React, { useEffect, useState } from "react";
import { addOrEditSingleEntry } from "../api/apiCalls";

export const ReceiptCard = ({
  selectedUser,
  receiptName,
  total,
  individualTotal,
  description,
  payTo,
  marked,
  paid,
  switchToReceipt,
  setChange,
}) => {
  const [updateMarked, setUpdateMarked] = useState(marked);
  const [updatePaid, setUpdatePaid] = useState(paid);

  function changeMarked() {
    Promise.all([
      addOrEditSingleEntry(
        `users/${selectedUser}/receipts/${receiptName}`,
        "marked",
        !updateMarked
      ),
      addOrEditSingleEntry(
        `receipts/${receiptName}/marked/`,
        selectedUser,
        !updateMarked
      ),
    ])
      .then(() => {
        setUpdateMarked((prevMarked) => !prevMarked);
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  function changePaid() {
    Promise.all([
      addOrEditSingleEntry(
        `users/${selectedUser}/receipts/${receiptName}`,
        "paid",
        !updatePaid
      ),
    ])
      .then(() => {
        setUpdatePaid((prevPaid) => !prevPaid);
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="flex justify mb-[30px] ">
      <button
        onClick={changePaid}
        className={
          (updatePaid ? "border-trueColor " : "border-falseColor ") +
          "w-1/12 border-l-2 border-t-2 border-b-2 rounded-l-md p-1"
        }
      >
        Paid
      </button>
      <button
        onClick={() => {
          switchToReceipt(receiptName);
        }}
        className="pt-[10px] px-[3px] h-full text-center bg-lightBackground w-full  text-darkFont"
      >
        <h1 className="text-heading text-darkFont">{receiptName}</h1>
        <h2 className="text-subheading"> ${total}</h2>
        <h3 className="text-accent text-subheading"> ${individualTotal} </h3>
        <div className="flex justify-between text-accent text-text">
          <p> Description: {description} </p>
          <p> Pay to: {payTo} </p>
        </div>
      </button>
      <button
        onClick={changeMarked}
        className={
          (updateMarked ? "border-trueColor " : "border-falseColor ") +
          "w-1/12 border-r-2 border-t-2 border-b-2 rounded-r-md p-1"
        }
      >
        Marked
      </button>
    </div>
  );
};
