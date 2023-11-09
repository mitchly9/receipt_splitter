import React from "react";
import { axiosPut } from "../api/apiCalls";

const AddReceiptPopUp = ({ setChange }) => {
  function addReceipt(e) {
    e.preventDefault();
    const receiptName = document.getElementById("receiptNameForm").value;
    const description = document.getElementById("descriptionForm").value;
    const payTo = document.getElementById("payToForm").value;
    const total = document.getElementById("totalForm").value;

    document.getElementById("receiptNameForm").value = "";
    document.getElementById("descriptionForm").value = "";
    document.getElementById("payToForm").value = "";
    document.getElementById("totalForm").value = "";

    const receipt = {
      description,
      payTo,
      total,
    };

    axiosPut(`receipts/${receiptName}`, receipt)
      .then(() => {
        document.getElementById("add-receipt").style.display = "none";
        setChange((prevChange) => prevChange + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteReceipt(e) {
    e.preventDefault();
    const receiptName = document.getElementById("receiptNameForm").value;
    if (receiptName === "") {
      document.getElementById("add-receipt").style.display = "none";
    } else {
    }
  }
  return (
    <form
      id={"add-receipt"}
      style={{ display: "none" }}
      className="w-1/2 bg-lightBackground rounded-lg p-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md"
    >
      <div className="mb-4">
        <input
          type="text"
          id="receiptNameForm"
          className="border rounded w-full p-2 text-darkFont mb-4"
          placeholder="Enter Receipt Name"
        />
        <input
          type="text"
          id="descriptionForm"
          className="border rounded w-full p-2 text-darkFont mb-4"
          placeholder="Enter Description Name"
        />
        <input
          type="text"
          id="payToForm"
          className="border rounded w-full p-2 text-darkFont mb-4"
          placeholder="Enter Person to Pay to"
        />
        <input
          type="text"
          id="totalForm"
          className="border rounded w-full p-2 text-darkFont"
          placeholder="Enter Total Price"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={(e) => {
            deleteReceipt(e);
          }}
          className="px-4 py-2 bg-accent text-lightFont rounded-md hover:bg-gradient-conic"
        >
          Delete Receipt
        </button>
        <button
          onClick={(e) => {
            addReceipt(e);
          }}
          type="submit"
          className="px-4 py-2 bg-accent text-lightFont rounded-md hover:bg-gradient-conic"
        >
          Add Receipt
        </button>
      </div>
    </form>
  );
};

export default AddReceiptPopUp;
