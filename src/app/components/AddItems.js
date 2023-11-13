import React from "react";
import Image from "next/image";

const AddItems = ({ admin }) => {
  const itemsToAdd = [];

  return admin ? (
    <div className="">
      <div className="">
        <form
          className="text-center bg-lightBackground p-2"
          onSubmit={(e) => {
            e.preventDefault();
            alert(e.target.elements.itemNumber.value);
          }}
        >
          <input
            type="text"
            placeholder="Item Number"
            name="itemNumber"
            className="p-2 m-1 border rounded-md w-48"
          />
        </form>
        <form className="text-center bg-lightBackground col-span-2 p-2">
          <input
            type="text"
            placeholder="Item Price"
            name="itemPrice"
            className="p-2 m-1 border rounded-md w-48"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          />
        </form>
      </div>
      <div className="grid grid-cols-5 bg-red-500">
        <div> Item Number </div>
        <div> Name </div>
        <div> Price </div>
        <div className="flex flex-col items-center">Item Images</div>
      </div>
      {/* {itemsToAdd.map((item) => (
        <div className="col-start-1"> {item}</div>
        <div className="col-start-2"> item Price </div>
      ))} */}
    </div>
  ) : null;
};

export default AddItems;
