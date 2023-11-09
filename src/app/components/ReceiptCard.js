import React, { useEffect } from "react";
import Link from "next/link";

export const ReceiptCard = ({
  receiptName,
  total,
  individualTotal,
  description,
  payTo,
}) => {
  return (
    <div className="pt-[10px] pr-[3px] pl-[3px] h-full text-center bg-lightBackground w-full rounded-md text-darkFont">
      <h1 className="text-heading text-darkFont">{receiptName}</h1>
      <h2 className="text-subheading"> ${total}</h2>
      <h3 className="text-accent text-subheading"> ${individualTotal} </h3>
      <div className="flex justify-between text-accent text-text">
        <p> Description: {description} </p>
        <p> Pay to: {payTo} </p>
      </div>
    </div>
  );
};
