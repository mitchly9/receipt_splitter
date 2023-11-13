import React, { useState } from "react";
import { addOrEditSingleEntry, axiosGet, axiosPost } from "../api/apiCalls";
import Image from "next/image";
import Link from "next/link";

const ItemAdder = ({ admin, selectedReceipt, setChange }) => {
  const [itemsToAdd, setItemsToAdd] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [itemPriceIndex, setItemPriceIndex] = useState(0);
  const [priceValue, setPriceValue] = useState("");

  function addItems() {
    let promises = [];
    for (let i = 0; i < Object.keys(itemsToAdd).length; i++) {
      promises.push(
        axiosPost(`receipts/${selectedReceipt}/items`, itemsToAdd[i])
      );

      promises.push(
        addOrEditSingleEntry("items", itemsToAdd[i].itemNumber, itemsToAdd[i])
      );
    }
    Promise.all(promises)
      .then(() => {
        setChange((prev) => prev + 1);
      })
      .catch((error) => console.log(error));
  }

  function fetchItem(itemNumber) {
    axiosGet(`items/${itemNumber}`)
      .then((returnedItem) => {
        if (returnedItem.data) {
          setItemsToAdd((prevItems) => ({
            ...prevItems,
            [Object.keys(itemsToAdd).length]: returnedItem.data,
          }));
        } else {
          setItemsToAdd((prevItems) => ({
            ...prevItems,
            [Object.keys(itemsToAdd).length]: {
              itemNumber: itemNumber,
              itemName: "",
              itemPrice: 0,
              imageAddress:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Question_mark.png/475px-Question_mark.png",
            },
          }));
        }
      })
      .catch((error) => console.log(error));
  }

  return admin ? (
    <div className="mt-10">
      <div className="flex justify-between items-center bg-lightBackground text-black">
        <form
          className="text-center bg-lightBackground p-2"
          onSubmit={(e) => {
            e.preventDefault();
            fetchItem(inputValue);

            setInputValue("");
          }}
        >
          <input
            type="text"
            placeholder="Item Number"
            name="itemNumber"
            className="p-2 m-1 border rounded-md w-48"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
        <div className="text-white">
          Total Items: {Object.keys(itemsToAdd).length} (+ Tax)
        </div>

        <form
          className="text-center bg-lightBackground col-span-2 p-2"
          onSubmit={(e) => {
            e.preventDefault();

            let value;
            if (priceValue.includes("-")) {
              const parts = priceValue.split("-");

              // Convert each part to a number
              const firstNumber = parseFloat(parts[0].trim());
              const secondNumber = parseFloat(parts[1].trim());

              // Subtract the numbers
              value = firstNumber - secondNumber;
            } else {
              value = priceValue;
            }

            setItemsToAdd((prev) => {
              const test = { ...prev };

              test[itemPriceIndex].itemPrice = value;

              return test;
            });
            setPriceValue("");
            setItemPriceIndex((prev) => prev + 1);
          }}
        >
          <input
            placeholder="Item Price"
            name="itemPrice"
            className="p-2 m-1 border rounded-md w-48"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
          />
        </form>
      </div>
      <div className="grid grid-cols-5 bg-accent">
        <div> Item Number </div>
        <div> Name </div>
        <div> Price </div>
        <div className="flex flex-col items-center">Item Image</div>
      </div>
      {Object.keys(itemsToAdd).map((singleItemNumber, index) => (
        <div key={index} className="grid grid-cols-5 p-2 border-b-2 ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setItemsToAdd((prev) => {
                const test = { ...prev };
                test[index].itemNumber =
                  e.target.elements.itemNumberChanger.value;
                return test;
              });
            }}
          >
            <input
              type="text"
              placeholder={itemsToAdd[singleItemNumber].itemNumber}
              id={`itemNumberChanger${index}`}
              name="itemNumberChanger"
              className="p-2  bg-darkBackground rounded-md w-48"
            />
          </form>
          {/* <div> {itemsToAdd[singleItemNumber].itemNumber} </div> */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setItemsToAdd((prev) => {
                const test = { ...prev };
                test[index].itemName = e.target.elements.itemNameChanger.value;
                return test;
              });
            }}
          >
            <input
              type="text"
              placeholder={itemsToAdd[singleItemNumber].itemName}
              name="itemNameChanger"
              className="p-2  bg-darkBackground rounded-md w-48"
            />
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setItemsToAdd((prev) => {
                const test = { ...prev };
                test[index].itemPrice = Number(
                  e.target.elements.itemPrice.value
                );
                return test;
              });
            }}
          >
            <input
              type="text"
              placeholder={`$${itemsToAdd[singleItemNumber].itemPrice}`}
              name="itemPrice"
              className={
                (itemPriceIndex === index ? "border border-accent " : "") +
                "p-2 bg-darkBackground rounded-md w-48"
              }
            />
          </form>
          <div className="flex items-center justify-center ">
            <Link
              target="_blank"
              href={`https://google.com/search?q=costco+${itemsToAdd[singleItemNumber].itemNumber}`}
              rel="noopener noreferrer"
            >
              <Image
                target="_blank"
                src={itemsToAdd[index].imageAddress}
                height={50}
                width={50}
                alt="image"
              />
            </Link>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setItemsToAdd((prev) => {
                const test = { ...prev };
                test[index].imageAddress = e.target.elements.imageAddress.value;
                return test;
              });
            }}
          >
            <input
              type="text"
              placeholder="Image Address"
              name="imageAddress"
              className="p-2 bg-darkBackground rounded-md w-48"
            />
          </form>
        </div>
      ))}
      <button
        onClick={addItems}
        className="border-2 ml-1 p-4  border-lightBackground rounded-md mt-1"
      >
        Add Items
      </button>
    </div>
  ) : null;
};

export default ItemAdder;
