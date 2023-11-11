export const userReceiptSchema = {
  individualTotal: 0,
  marked: false,
  paid: false,
};

export const receiptSchema = {
  actualTota: 0,
  description: "",
  individualTotals: {},
  marked: {},
  payTo: "",
  total: 0,
  usersPayingTotal: 0,
};

export const itemSchema = {
  imageAddress: "",
  itemName: "",
  itemNumber: "",
  itemPrice: "",
  usersBuying: {},
};
