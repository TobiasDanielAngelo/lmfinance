import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { Report, ReportFields, ReportInterface } from "../../api/ReportStore";
import { useStore } from "../../api/Store";
import {
  ActionModalDef,
  KV,
  MySpeedDialProps,
} from "../../constants/interfaces";
import { MyGenericCard } from "../../blueprints/MyGenericComponents/MyGenericCard";
import { MyGenericCollection } from "../../blueprints/MyGenericComponents/MyGenericCollection";
import { MyGenericFilter } from "../../blueprints/MyGenericComponents/MyGenericFilter";
import { MyGenericForm } from "../../blueprints/MyGenericComponents/MyGenericForm";
import { createGenericViewContext } from "../../blueprints/MyGenericComponents/MyGenericProps";
import { MyGenericRow } from "../../blueprints/MyGenericComponents/MyGenericRow";
import { MyGenericTable } from "../../blueprints/MyGenericComponents/MyGenericTable";
import {
  MyGenericView,
  useViewValues,
} from "../../blueprints/MyGenericComponents/MyGenericView";
import { SideBySideView } from "../../blueprints/SideBySideView";
import { useVisible } from "../../constants/hooks";
import { Field } from "../../constants/interfaces";
import moment from "moment";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { MyButton, MyDropdownSelector, MyInput } from "../../blueprints";
import { MySpeedDial } from "../../blueprints/MySpeedDial";
import { MyModal } from "../../blueprints/MyModal";
import { ExpenseForm } from "./ExpenseComponents";
import { IncomeForm } from "./IncomeComponents";
import { TransferForm } from "./TransferComponents";
import { getStoreItem } from "../../api/GenericStore";
import { MyIcon } from "../../blueprints/MyIcon";
import { HView } from "../../blueprints/HView";
import { mySum, sortByKey, toMoney } from "../../constants/helpers";
import { winWidth } from "../../constants/constants";

export const { Context: ReportViewContext, useGenericView: useReportView } =
  createGenericViewContext<ReportInterface>();

const title = "Reports";

export const ReportIdMap = {} as const;

export const ReportForm = ({
  item,
  setVisible,
  fetchFcn,
}: {
  item?: Report;
  setVisible?: (t: boolean) => void;
  fetchFcn?: () => void;
}) => {
  const { reportStore } = useStore();
  const monthOptions = Array.from(Array(100).keys()).map((s) => ({
    id: `${moment(new Date(2025 + Math.floor(s / 12), s % 12, 1)).format(
      "YYYY-MM"
    )}`,
    name: `${moment(new Date(2025 + Math.floor(s / 12), s % 12, 1)).format(
      "MMM YYYY"
    )}`,
  }));
  const fields = useMemo(
    () =>
      [
        [
          {
            name: "monthYear",
            label: "Month of",
            type: "select",
            options: monthOptions,
          },
        ],
        [
          {
            name: "beginningBalance",
            label: "Beginning Balance",
            type: "text",
          },
        ],
        [{ name: "endingBalance", label: "Ending Balance", type: "text" }],
        [{ name: "cashOnHand", label: "Cash On Hand", type: "text" }],
        [{ name: "cashOnBank", label: "Cash On Bank", type: "text" }],
      ] satisfies Field[][],
    []
  );

  return (
    <MyGenericForm<ReportInterface>
      item={item?.$ ?? item}
      setVisible={setVisible}
      fetchFcn={fetchFcn}
      objectName="report"
      fields={fields}
      store={reportStore}
      datetimeFields={ReportFields.datetimeFields}
      dateFields={ReportFields.dateFields}
      timeFields={ReportFields.timeFields}
    />
  );
};

export const ReportCard = observer((props: { item: Report }) => {
  const { item } = props;
  const { fetchFcn, shownFields, itemMap } = useReportView();
  const { reportStore } = useStore();

  return (
    <MyGenericCard
      item={item}
      shownFields={shownFields}
      header={["id"]}
      important={[]}
      prices={ReportFields.pricesFields}
      FormComponent={ReportForm}
      deleteItem={reportStore.deleteItem}
      fetchFcn={fetchFcn}
      itemMap={itemMap}
    />
  );
});

export const ReportCollection = observer(() => {
  const { reportStore } = useStore();
  const { pageDetails, PageBar } = useReportView();

  return (
    <SideBySideView
      SideA={
        <MyGenericCollection
          CardComponent={ReportCard}
          title={title}
          pageDetails={pageDetails}
          PageBar={PageBar}
          items={reportStore.items}
        />
      }
      SideB=""
      ratio={0.7}
    />
  );
});

export const ReportFilter = observer(() => {
  return (
    <MyGenericFilter
      view={new Report({}).$view}
      title="Report Filters"
      dateFields={[...ReportFields.datetimeFields, ...ReportFields.dateFields]}
      excludeFields={["id"]}
      relatedFields={[]}
      optionFields={[]}
    />
  );
});

export const ReportRow = observer((props: { item: Report }) => {
  const { item } = props;
  const { fetchFcn } = useReportView();
  const { reportStore } = useStore();

  return (
    <MyGenericRow
      item={item}
      FormComponent={ReportForm}
      deleteItem={reportStore.deleteItem}
      fetchFcn={fetchFcn}
    />
  );
});

export const ReportTable = observer(() => {
  const { reportStore } = useStore();
  const values = useReportView();
  const { pageDetails } = values;

  return (
    <MyGenericTable
      items={reportStore.items}
      pageIds={pageDetails?.ids ?? []}
      renderActions={(item) => <ReportRow item={item} />}
      priceFields={ReportFields.pricesFields}
      {...values}
    />
  );
});

export const ReportView = observer(() => {
  const {
    collectionStore,
    expenseStore,
    incomeStore,
    transferStore,
    memberStore,
    reportStore,
  } = useStore();
  const {
    isVisible1,
    setVisible1,
    isVisible2,
    setVisible2,
    isVisible3,
    setVisible3,
    isVisible4,
    setVisible4,
    isVisible5,
    setVisible5,
  } = useVisible();
  const [month, setMonth] = useState<number | null>(null);
  const [details, setDetails] = useState({
    monthYear: "",
    beginningBalance: "",
    beginningCashOnHand: "",
    beginningCashOnBank: "",
    handAdditions: "",
    bankAdditions: "",
  });
  const [begBal, setBegBal] = useState("");
  const [handAdd, setHandAdd] = useState("");

  const monthOptions = Array.from(Array(100).keys()).map((s) => ({
    id: `${moment(new Date(2025 + Math.floor(s / 12), s % 12, 1)).format(
      "YYYY-MM"
    )}`,
    name: `${moment(new Date(2025 + Math.floor(s / 12), s % 12, 1)).format(
      "MMM YYYY"
    )}`,
  }));

  useEffect(() => {
    setMonth(monthOptions[6].id as any);
  }, []);
  const monthPart = String(month).slice(5, 7);
  const yearPart = String(month).slice(0, 4);

  const fetchFcn = async () => {
    collectionStore.fetchAll(
      `page=all&collection_date__month=${Number(
        monthPart
      )}&collection_date__year=${Number(yearPart)}`
    );
    expenseStore.fetchAll(
      `page=all&date_added__month=${Number(
        monthPart
      )}&date_added__year=${Number(yearPart)}`
    );
    incomeStore.fetchAll(
      `page=all&date_added__month=${Number(
        monthPart
      )}&date_added__year=${Number(yearPart)}`
    );
    transferStore.fetchAll(
      `page=all&date_added__month=${Number(
        monthPart
      )}&date_added__year=${Number(yearPart)}`
    );
  };

  const allCollections = !month
    ? []
    : collectionStore.items.map((s) => {
        const member = memberStore.items
          .map((m) => m.$view)
          .find((t) => t.id === s.member);
        const start = moment(s.startMonth, "YYYY-MM-DD");
        const end = moment(s.endMonth, "YYYY-MM-DD");

        const sameYear = start.year() === end.year();

        const dateRange = sameYear
          ? `${start.format("MMM")} to ${end.format("MMM 'YY")}`
          : `${start.format("MMM 'YY")} to ${end.format("MMM 'YY")}`;

        return {
          date: s.collectionDate,
          particulars: `AR # ${s.receiptNumber} - ${member?.fullName} (${dateRange})`,
          expense: 0,
          income: s.amount,
        };
      });

  const allIncomes = !month
    ? []
    : incomeStore.items.map((s) => {
        return {
          date: s.dateAdded,
          particulars: s.notes,
          expense: 0,
          income: s.amount,
        };
      });
  const allExpenses = !month
    ? []
    : expenseStore.items.map((s) => {
        return {
          date: s.dateAdded,
          particulars: s.notes,
          expense: -s.amount,
          income: 0,
        };
      });

  const lineItems = sortByKey(
    [...allCollections, ...allExpenses, ...allIncomes],
    "date"
  ).filter(
    (s) => moment(s.date, "YYYY-MM-DD").format("YYYY-MM") === String(month)
  );

  const allTransfers = sortByKey(
    transferStore.items.map((s) => ({
      date: s.dateAdded,
      particulars: s.notes,
      income: (s.toBank ? -1 : 1) * s.amount,
      expense: (s.toBank ? 1 : -1) * s.amount,
    })),
    "date"
  );
  const [msg, setMsg] = useState("");

  const MAX_LINES = 35;
  const FONT_SIZE = 0.013 * winWidth;

  const prevReport = reportStore.items.find(
    (s) =>
      s.monthYear ===
      moment(month, "YYYY-MM").subtract(1, "month").format("YYYY-MM")
  );

  const prevBal = prevReport?.endingBalance ?? 0;
  const prevCash = prevReport?.endingCashOnHand ?? 0;
  const prevBank = prevReport?.endingCashOnBank ?? 0;
  const existingReport = reportStore.items.find(
    (s) => s.monthYear === String(month)
  );

  useEffect(() => {
    if (existingReport) {
      setDetails({
        monthYear: existingReport.monthYear,
        beginningBalance: String(existingReport.beginningBalance),
        beginningCashOnHand: String(existingReport.beginningCashOnHand),
        beginningCashOnBank: String(existingReport.beginningCashOnBank),
        handAdditions: String(existingReport.handAdditions),
        bankAdditions: String(existingReport.bankAdditions),
      });
    } else if (prevReport) {
      setDetails({
        ...details,
        beginningBalance: String(prevBal),
        beginningCashOnBank: String(prevBank),
        beginningCashOnHand: String(prevCash),
        handAdditions: "",
        bankAdditions: "",
      });
    }
    setMsg("");
    if (month) fetchFcn();
  }, [month]);

  const actions = [
    { icon: "money-check", name: "Transfer", onPress: () => setVisible1(true) },
    {
      icon: "money-bill",
      name: "Additional Incomes",
      onPress: () => setVisible2(true),
    },
    {
      icon: "money-bill-wave",
      name: "New Expenses",
      onPress: () => setVisible3(true),
    },
  ] satisfies MySpeedDialProps[];

  const matrix = useMemo(
    () =>
      month
        ? [
            ["DATE", "PARTICULARS", "COLLECTIONS", "EXPENSES", "BALANCE"],
            [
              moment(month, "YYYY-MM").format("MMM D"),
              "Beginning Balance",
              "",
              "",
              <Pressable onPress={() => setVisible4(true)}>
                <Text
                  onPress={() => setVisible4(true)}
                  style={{
                    color: "blue",
                    fontSize: FONT_SIZE,
                  }}
                >
                  {details.beginningBalance !== ""
                    ? `${toMoney(parseFloat(details.beginningBalance))}`
                    : "Edit"}
                </Text>
              </Pressable>,
            ],
            ...lineItems.map((s) => [
              moment(s.date, "YYYY-MM-DD").format("MMM D"),
              s.particulars,
              s.income !== 0 ? toMoney(s.income) : "",
              s.expense !== 0 ? toMoney(s.expense) : "",
            ]),
            ...Array.from(Array(MAX_LINES - 2 - lineItems.length).keys()).map(
              (z) => ["", "", "", ""]
            ),
            [
              "",
              "TOTAL",
              toMoney(mySum(lineItems.map((s) => s.income))),
              toMoney(mySum(lineItems.map((s) => s.expense))),
              toMoney(mySum(lineItems.map((s) => s.expense + s.income))),
              ,
            ],
            [
              "",
              "TOTAL COLLECTIONS",
              "",
              "",
              toMoney(
                mySum(lineItems.map((s) => s.expense + s.income)) +
                  parseFloat(details.beginningBalance)
              ),
            ],
          ]
        : [],
    [month, details.beginningBalance, lineItems.length]
  );

  const matrix2 = useMemo(
    () =>
      month
        ? [
            ["DATE", "TRANSFERS", "CASH-ON-HAND", "CASH-ON-BANK", "SUBTOTAL"],
            [
              moment(month, "YYYY-MM").format("MMM D"),
              "Initial",
              details.beginningCashOnHand !== ""
                ? `${toMoney(parseFloat(details.beginningCashOnHand))}`
                : "",
              details.beginningCashOnBank !== ""
                ? `${toMoney(parseFloat(details.beginningCashOnBank))}`
                : "",
              toMoney(
                parseFloat(details.beginningCashOnBank) +
                  parseFloat(details.beginningCashOnHand)
              ),
            ],
            ...allTransfers.map((s) => [
              moment(s.date, "YYYY-MM-DD").format("MMM D"),
              s.income > 0 ? "Withdraw from Bank" : "Deposit to Bank",
              toMoney(s.income),
              toMoney(s.expense),
              toMoney(s.expense + s.income),
            ]),
            [
              moment(month, "YYYY-MM").format("MMMM"),
              "Contribution from this Month",
              <Pressable onPress={() => setVisible5(true)}>
                <Text
                  onPress={() => setVisible5(true)}
                  style={{
                    color: "blue",
                    fontSize: FONT_SIZE,
                  }}
                >
                  {details.handAdditions !== ""
                    ? `${toMoney(parseFloat(details.handAdditions))}`
                    : "Edit"}
                </Text>
              </Pressable>,
              toMoney(parseFloat(details.bankAdditions)),
              toMoney(
                mySum(lineItems.map((s) => s.expense + s.income)) +
                  parseFloat(details.beginningBalance)
              ),
            ],
            [
              "TOTAL",
              "TOTAL PER ACCOUNT",
              toMoney(
                parseFloat(details.beginningCashOnHand) +
                  mySum(allTransfers.map((s) => s.income)) +
                  parseFloat(
                    details.handAdditions === "" ? "0" : details.handAdditions
                  )
              ),
              toMoney(
                parseFloat(details.beginningCashOnBank) +
                  mySum(allTransfers.map((s) => s.expense)) +
                  parseFloat(
                    details.bankAdditions === "" ? "0" : details.bankAdditions
                  )
              ),
              toMoney(
                parseFloat(details.beginningCashOnBank) +
                  parseFloat(details.beginningCashOnHand) +
                  mySum(lineItems.map((s) => s.expense + s.income)) +
                  parseFloat(details.beginningBalance)
              ),
            ],
          ]
        : [],
    [
      month,
      details.handAdditions,
      details.bankAdditions,
      lineItems.length,
      allTransfers.length,
      details.beginningCashOnHand,
      details.beginningCashOnBank,
    ]
  );

  const onPressSave = async () => {
    if (
      details.handAdditions === "" ||
      details.bankAdditions === "" ||
      details.beginningBalance === "" ||
      details.beginningCashOnBank === "" ||
      details.beginningCashOnHand === ""
    ) {
      return;
    }

    const transformedDetails = {
      monthYear: String(month),
      beginningBalance: parseFloat(details.beginningBalance),
      endingBalance:
        parseFloat(details.beginningCashOnBank) +
        parseFloat(details.beginningCashOnHand) +
        mySum(lineItems.map((s) => s.expense + s.income)) +
        parseFloat(details.beginningBalance),
      beginningCashOnHand: parseFloat(details.beginningCashOnHand),
      beginningCashOnBank: parseFloat(details.beginningCashOnBank),
      endingCashOnHand:
        parseFloat(details.beginningCashOnHand) +
        mySum(allTransfers.map((s) => s.income)) +
        parseFloat(details.handAdditions === "" ? "0" : details.handAdditions),
      endingCashOnBank:
        parseFloat(details.beginningCashOnBank) +
        mySum(allTransfers.map((s) => s.expense)) +
        parseFloat(details.bankAdditions === "" ? "0" : details.bankAdditions),
      handAdditions: parseFloat(details.handAdditions),
      bankAdditions: parseFloat(details.bankAdditions),
    };
    let resp;
    if (!existingReport) {
      resp = await reportStore.addItem(transformedDetails);
    } else {
      resp = await reportStore.updateItem(
        existingReport.id,
        transformedDetails
      );
    }
    if (!resp.ok) {
      setMsg(resp.details ?? "Error");
      return;
    } else {
      setMsg("Success!");
    }
  };

  return (
    <View style={{ paddingTop: 10, paddingHorizontal: 20, flex: 1 }}>
      <MyModal
        isVisible={isVisible4}
        setVisible={setVisible4}
        title="Beginning Balance"
      >
        <MyInput
          value={begBal}
          onChangeValue={setBegBal}
          corrector={(t: string) => {
            return String(isNaN(parseFloat(t)) ? "" : t);
          }}
        />
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <MyIcon
            icon="check"
            onPress={() => {
              setDetails({
                ...details,
                beginningBalance: begBal,
                beginningCashOnHand: "0",
                beginningCashOnBank: begBal,
              });
              setVisible4(false);
            }}
          />
          <MyIcon
            icon="star"
            label="Prev. Bal."
            size={12}
            onPress={() => {
              setBegBal(String(prevBal));
              setDetails({
                ...details,
                beginningBalance: String(prevBal),
                beginningCashOnBank: begBal,
                beginningCashOnHand: "0",
              });
            }}
          />
        </View>
      </MyModal>
      <MyModal
        isVisible={isVisible5}
        setVisible={setVisible5}
        title="Cash on Hand Adjustments"
      >
        <MyInput
          value={handAdd}
          onChangeValue={setHandAdd}
          corrector={(t: string) => {
            return String(isNaN(parseFloat(t)) ? "" : t);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <MyIcon
            icon="check"
            onPress={() => {
              setDetails({
                ...details,
                handAdditions: handAdd,
                bankAdditions: String(
                  mySum(lineItems.map((s) => s.expense + s.income)) +
                    parseFloat(details.beginningBalance) -
                    parseFloat(handAdd)
                ),
              });
              setVisible5(false);
            }}
          />
        </View>
      </MyModal>
      <MyModal isVisible={isVisible1} setVisible={setVisible1}>
        <TransferForm setVisible={setVisible1} />
      </MyModal>
      <MyModal isVisible={isVisible2} setVisible={setVisible2}>
        <IncomeForm setVisible={setVisible2} />
      </MyModal>
      <MyModal isVisible={isVisible3} setVisible={setVisible3}>
        <ExpenseForm setVisible={setVisible3} />
      </MyModal>
      <MyDropdownSelector
        options={monthOptions}
        value={month}
        onChangeValue={setMonth}
      />
      <ScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            aspectRatio: 1 / 1.294,
            width: "100%",
            borderWidth: 1,
            // alignItems: "center",
            padding: 20,
          }}
        >
          <Image
            source={require("../../../assets/images/snt-logo.png")}
            resizeMode="contain"
            style={{
              position: "absolute",
              width: 50,
              height: 60,
              top: 20,
              left: "20%",
            }}
          />
          <Text style={{ fontSize: 12, textAlign: "center" }}>
            Diocese of Cabanatuan
          </Text>
          <Text
            style={{ fontSize: 15, fontWeight: "bold", textAlign: "center" }}
          >
            THE CABANATUAN CATHEDRAL
          </Text>
          <Text style={{ fontSize: 12, textAlign: "center" }}>
            Cabanatuan City
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>
              SNT Lay Ministry
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                display: month ? "flex" : "none",
              }}
            >
              Month of {moment(month, "YYYYMM").format("MMMM, YYYY")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              borderWidth: 0.5,
              marginVertical: 5,
            }}
          >
            {matrix.map((q, indq) => (
              <View key={indq} style={{ flexDirection: "row" }}>
                {q.map((s, ind) => (
                  <View
                    style={{
                      width: ind === 1 ? "50%" : "12.5%",
                      borderWidth: 1,
                    }}
                    key={ind}
                  >
                    <Text
                      style={{
                        textAlign:
                          indq === 0 || ind === 0
                            ? "center"
                            : ind === 1
                            ? "left"
                            : "right",
                        fontWeight:
                          indq === 0 || indq > MAX_LINES - 1
                            ? "bold"
                            : "normal",
                        marginHorizontal: indq === 0 ? 0 : 10,
                        fontSize: FONT_SIZE,
                      }}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {s}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: "column",
              borderWidth: 0.5,
              marginVertical: 10,
            }}
          >
            {matrix2.map((q, indq) => (
              <View key={indq} style={{ flexDirection: "row" }}>
                {q.map((s, ind) => (
                  <View
                    style={{
                      width: ind === 1 ? "50%" : "12.5%",
                      borderWidth: 1,
                    }}
                    key={ind}
                  >
                    <Text
                      style={{
                        textAlign:
                          indq === 0 || ind === 0
                            ? "center"
                            : ind === 1
                            ? "left"
                            : "right",
                        fontWeight:
                          indq === 0 || indq > MAX_LINES - 1
                            ? "bold"
                            : "normal",
                        marginHorizontal: indq === 0 ? 0 : 10,
                        fontSize: FONT_SIZE,
                      }}
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {s}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <MyButton label="Save" onPress={onPressSave} />
          <Text
            style={{
              color: msg === "Success!" ? "green" : "darkred",
              textAlign: "center",
            }}
          >
            {msg}
          </Text>
        </View>
      </ScrollView>
      <MySpeedDial actions={actions} />
    </View>
  );
});
