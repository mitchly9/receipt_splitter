export const OverviewReceiptCard = ({
  receiptName,
  total,
  description,
  payTo,
  users,
  switchToReceipt,
  setSelectedUser,
  individualTotals,
  marked,
}) => {
  function handleSwitch(receiptName, user) {
    setSelectedUser(user);
    switchToReceipt(receiptName);
  }

  return (
    <div
      key={receiptName}
      className="pt-[10px] px-[3px] mb-[30px] text-center bg-lightBackground w-full rounded-md  text-darkFont"
    >
      <h1 className="text-heading text-darkFont">{receiptName}</h1>
      <h2 className="text-subheading"> ${total}</h2>
      <ul className="flex justify-evenly">
        {users && users.length !== 0 ? (
          users.map((user) => (
            <button
              key={`${user} User List`}
              className={
                (marked[user] === true
                  ? "border-2 border-trueColor mx-2 mb-1"
                  : "border-2 border-falseColor  mx-2 mb-1") +
                "text-text w-fit p-4 rounded-md mt-2"
              }
              onClick={() => {
                handleSwitch(receiptName, user);
              }}
            >
              <h1>{user}</h1>
              <h2 className="text-[6px] text-accent">
                ${individualTotals[user]}
              </h2>
            </button>
          ))
        ) : (
          <div className="w-fit border-2 text-heading border-darkBackground p-4 rounded-md mt-2">
            Nobody
          </div>
        )}
      </ul>
      <div className="flex justify-between text-accent text-text mt-1">
        <p> Description: {description} </p>
        <p> Pay to: {payTo} </p>
      </div>
    </div>
  );
};
