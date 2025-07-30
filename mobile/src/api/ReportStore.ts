import { prop } from "mobx-keystone";
import { PropsToInterface, ViewFields } from "../constants/interfaces";
import { MyModel, MyStore } from "./GenericStore";

const slug = "reports/";
const keyName = "Report";
const props = {
  id: prop<number | string>(-1),
  monthYear: prop<string>(""),
  beginningBalance: prop<number>(0),
  endingBalance: prop<number>(0),
  beginningCashOnHand: prop<number>(0),
  beginningCashOnBank: prop<number>(0),
  endingCashOnHand: prop<number>(0),
  endingCashOnBank: prop<number>(0),
  handAdditions: prop<number>(0),
  bankAdditions: prop<number>(0),
  createdAt: prop<string>(""),
};

export type ReportInterface = PropsToInterface<typeof props>;
export class Report extends MyModel(keyName, props) {}
export class ReportStore extends MyStore(keyName, Report, slug) {}

export const ReportFields: ViewFields<ReportInterface> = {
  datetimeFields: ["createdAt"] as const,
  dateFields: [] as const,
  timeFields: [] as const,
  pricesFields: [
    "beginningBalance",
    "endingBalance",
    "beginningCashOnBank",
    "beginningCashOnHand",
    "endingCashOnBank",
    "endingCashOnHand",
  ] as const,
};
