import { prop } from "mobx-keystone";
import { PropsToInterface, ViewFields } from "../constants/interfaces";
import { MyModel, MyStore } from "./GenericStore";

const slug = "incomes/";
const keyName = "Income";
const props = {
  id: prop<number | string>(-1),
  dateAdded: prop<string>(""),
  amount: prop<number>(0),
  notes: prop<string>(""),
};

export type IncomeInterface = PropsToInterface<typeof props>;
export class Income extends MyModel(keyName, props) {}
export class IncomeStore extends MyStore(keyName, Income, slug) {}

export const IncomeFields: ViewFields<IncomeInterface> = {
  datetimeFields: [] as const,
  dateFields: ["dateAdded"] as const,
  timeFields: [] as const,
  pricesFields: ["amount"] as const,
};
