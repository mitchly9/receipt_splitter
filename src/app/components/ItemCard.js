import React, { useEffect, useState } from "react";
import Image from "next/image";
import { addOrEditSingleEntry, axiosGet, deleteEntry } from "../api/apiCalls";

const ItemCard = ({
  item,
  index,
  selectedReceipt,
  selectedUser,
  setChange,
  usersPaying,
}) => {
  const [currentlyBuying, setCurrentlyBuying] = useState(
    "usersBuying" in item
      ? Object.keys(item.usersBuying).includes(selectedUser)
      : false
  );
  useEffect(() => {
    setCurrentlyBuying(
      "usersBuying" in item
        ? Object.keys(item.usersBuying).includes(selectedUser)
        : false
    );
  }, [item, selectedUser]);

  function addPerson(userAdded) {
    axiosGet(`receipts/${selectedReceipt}/items/${index}`).then(
      (updatedItemObj) => {
        let updatedItem = updatedItemObj.data;
        if ("usersBuying" in updatedItem) {
          addOrEditSingleEntry(
            `receipts/${selectedReceipt}/items/${index}/usersBuying`,
            userAdded,
            userAdded
          )
            .then(() => {
              if (selectedUser === userAdded) {
                setCurrentlyBuying((prevBuying) => !prevBuying);
              }
              setChange((prevChange) => prevChange + 1);
            })
            .catch((error) => console.log(error));
        } else {
          addOrEditSingleEntry(
            `receipts/${selectedReceipt}/items/${index}/usersBuying`,
            userAdded,
            userAdded
          )
            .then(() => {
              setChange((prevChange) => prevChange + 1);
              if (selectedUser === userAdded) {
                setCurrentlyBuying((prevBuying) => !prevBuying);
              }
            })
            .catch((error) => console.log(error));
        }
      }
    );
  }

  function removePerson(userRemoved) {
    deleteEntry(
      `receipts/${selectedReceipt}/items/${index}/usersBuying`,
      userRemoved
    )
      .then(() => {
        setChange((prevChange) => prevChange + 1);
        if (selectedUser === userRemoved) {
          setCurrentlyBuying((prevBuying) => !prevBuying);
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="items-center rounded-md text-center w-full bg-lightBackground p-3 break-all">
      <h2 className="ml-10 flex justify-center text-heading">
        ${item.itemPrice}
        {"usersBuying" in item ? (
          <p className="text-text text-accent">
            (
            {Math.round(
              (item.itemPrice / Object.keys(item.usersBuying).length) * 100
            ) / 100}{" "}
            per)
          </p>
        ) : (
          <p className="text-text text-accent">(N/A)</p>
        )}
      </h2>
      <Image
        alt={"Picture of " + item.itemName}
        src={item.imageAddress}
        width={1000}
        height={1000}
        className="rounded mr-4"
      />
      <div className="">
        <div className="h-fit self-center place-self-center">
          {usersPaying.length !== 0 ? (
            usersPaying.map((user) =>
              user !== selectedUser ? (
                "usersBuying" in item ? (
                  Object.keys(item.usersBuying).includes(user) ? (
                    <button
                      key={user + selectedReceipt + index}
                      className="border-2 border-trueColor  mx-2 mb-1 text-text w-fit p-4 rounded-md mt-2"
                      onClick={() => {
                        removePerson(user);
                      }}
                    >
                      {user}
                    </button>
                  ) : (
                    <button
                      key={user + selectedReceipt + index}
                      className="border-2 border-falseColor  mx-2 mb-1 text-text w-fit p-4 rounded-md mt-2"
                      onClick={() => {
                        addPerson(user);
                      }}
                    >
                      {user}
                    </button>
                  )
                ) : (
                  <button
                    key={user + selectedReceipt + index}
                    className="border-2 border-falseColor  mx-2 mb-1 text-text w-fit p-4 rounded-md mt-2"
                    onClick={() => {
                      addPerson(user);
                    }}
                  >
                    {user}
                  </button>
                )
              ) : null
            )
          ) : (
            <div className="w-fit border-2 text-heading border-darkBackground p-4 rounded-md mt-2">
              Nobody
            </div>
          )}
        </div>
        {currentlyBuying ? (
          <button
            className="w-full px-4 py-3 mt-1 border-2 border-trueColor "
            onClick={() => {
              removePerson(selectedUser);
            }}
          >
            Remove {item.itemName}
          </button>
        ) : (
          <button
            className="w-full px-4 py-3 mt-1 border-2 border-falseColor "
            onClick={() => {
              addPerson(selectedUser);
            }}
          >
            Add {item.itemName}
          </button>
        )}
      </div>
      <div className="flex flex-wrap"></div>
    </div>
  );
};

export default ItemCard;
