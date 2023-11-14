import React from "react";
import Image from "next/image";
import { deleteBranch, addOrEditSingleEntry } from "../api/apiCalls";

const ItemEditor = ({
  item,
  itemID,
  selectedReceipt,
  selectedUser,
  setChange,
  usersPaying,
}) => {
  function changeField(key, value) {
    addOrEditSingleEntry(
      `/receipts/${selectedReceipt}/items/${itemID}`,
      key,
      value
    ).then(() => {
      setChange((prev) => prev + 1);
    });
  }
  function removeItem() {
    console.log(selectedReceipt);
    console.log(itemID);
    deleteBranch(`/receipts/${selectedReceipt}/items/${itemID}`).then(() =>
      setChange((prev) => prev + 1)
    );
  }

  return (
    <div className="items-center rounded-md text-center w-full bg-lightBackground p-3 break-all">
      <div className="flex justify-center content-center items-center mb-3">
        <input
          id={`priceChange${itemID}`}
          className="text-center rounded border-2 bg-lightBackground border-lightBackground block p-2 text-darkFont w-min"
          placeholder={item.itemPrice}
        />
        <button
          onClick={() => {
            changeField(
              "itemPrice",
              document.getElementById(`priceChange${itemID}`).value
            );
          }}
          className="border-2 border-lightBackground ml-1 p-4  self-center  rounded-md mt-1"
        ></button>
      </div>
      <Image
        alt={"Picture of " + item.itemName}
        src={item.imageAddress}
        width={1000}
        height={1000}
        className="rounded mr-4"
      />
      <div className="flex justify-center content-center items-center mb-3">
        <input
          className="text-center rounded border-2 bg-lightBackground border-lightBackground block p-2 text-darkFont w-min"
          placeholder={item.imageAddress}
        />
        <button className="border-2 border-lightBackground ml-1 p-4  self-center  rounded-md mt-1"></button>
      </div>
      <div className="flex justify-center content-center items-center mb-3">
        <input
          id={"nameChange" + itemID}
          className="text-center rounded border-2 bg-lightBackground border-lightBackground block p-2 text-darkFont w-min"
          placeholder={item.itemName}
        />
        <button
          onClick={() => {
            changeField(
              "itemName",
              document.getElementById(`nameChange${itemID}`).value
            );
          }}
          className="border-2 border-lightBackground ml-1 p-4  self-center  rounded-md mt-1"
        ></button>
      </div>
      <button
        onClick={removeItem}
        className="border-2 border-falseColor ml-1 p-4  self-center  rounded-md mt-1"
      >
        Delete
      </button>
    </div>
  );
};

export default ItemEditor;
