export type ViewPath = {
  title: string;
  items?: string[];
  mainLink?: string;
};

export const allViewPaths = [
  {
    title: "Receipts",
    items: ["receipts"],
    mainLink: "receipts",
  },
  {
    title: "Table",
    items: ["collection-table"],
    mainLink: "collection-table",
  },
  {
    title: "Members",
    items: ["members"],
    mainLink: "members",
  },
  {
    title: "Reports",
    items: ["reports"],
    mainLink: "reports",
  },

  {
    title: "Transfers",
    items: ["bank-statements"],
    mainLink: "bank-statements",
  },
  {
    title: "More Incomes",
    items: ["incomes"],
    mainLink: "incomes",
  },
  {
    title: "Expenses",
    items: ["expenses"],
    mainLink: "expenses",
  },
] as ViewPath[];
