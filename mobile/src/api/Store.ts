import { model, Model, prop } from "mobx-keystone";
import { createContext, useContext } from "react";
import { ReportStore } from "./ReportStore";
import { MemberStore } from "./MemberStore";
import { CollectionStore } from "./CollectionStore";
import { ExpenseStore } from "./ExpenseStore";
import { TransferStore } from "./TransferStore";
import { SettingStore } from "./SettingStore";
import { IncomeStore } from "./IncomeStore";

@model("myApp/Store")
export class Store extends Model({
  reportStore: prop<ReportStore>(),
  memberStore: prop<MemberStore>(),
  collectionStore: prop<CollectionStore>(),
  expenseStore: prop<ExpenseStore>(),
  incomeStore: prop<IncomeStore>(),
  transferStore: prop<TransferStore>(),
  settingStore: prop<SettingStore>(),
}) {}

export const createStore = () =>
  new Store({
    reportStore: new ReportStore({}),
    memberStore: new MemberStore({}),
    collectionStore: new CollectionStore({}),
    expenseStore: new ExpenseStore({}),
    transferStore: new TransferStore({}),
    incomeStore: new IncomeStore({}),
    settingStore: new SettingStore({}),
  });

export const StoreContext = createContext<Store | null>(null);
export const useStore = () => useContext(StoreContext)!;
