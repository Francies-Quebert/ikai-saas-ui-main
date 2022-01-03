import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Space, Button } from "antd";
import { fetchDataBankWalletGatewayBook } from "../../services/payModeMaster";
import BankAndCashBookTableDetail from "./components/BankAndCashBookTableDetail";
import moment from "moment";
import fileDownload from "js-file-download";
import BankComponent from "./components/BankComponent";
import HeaderComponent from "./components/HeaderComponent";
import styled from "styled-components";
import BankAndCashBookLegends from "./components/BankAndCashBookLegends";
import { Fragment } from "react";
import { SyncOutlined } from "@ant-design/icons";
import { setFormCaption } from "../../store/actions/currentTran";
// import { hasRight } from "../../../shared/utility";
import {
  hasRightToBeUsedNext,
  PrintPdfOrFromElectron,
} from "../../shared/utility";
import { getBankandCashBookStatementPdf } from "../../services/receipts-payments";

const { RangePicker } = DatePicker;

//import styled from 'styled-components'

const BankAndCashBook = (props) => {
  const dispatch = useDispatch();
  const [bankAndCashAccounts, setBankAndCashAccounts] = useState();
  const [dateRange, setDateRange] = useState([moment(), moment()]);
  const [selectedData, setSelectedData] = useState();
  const [loading, setIsLoading] = useState(false);
  const [PrintStatus, setPrintStatus] = useState(false);
  const l_ModuleRights = useSelector((state) =>
    state.AppMain.userAccess.find(
      (oo) =>
        oo.ModuleId ===
        (props.TranType === "CASH" ? 118 : props.TranType === "BANK" ? 119 : 0)
    )
  );

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    if (dateRange && dateRange.length > 0) {
      //TODO: Fetch Data From API
      fetchDataBankWalletGatewayBook(
        CompCode,
        props.IsCashFlow ? "CASH" : null,
        dateRange === null ? null : moment(dateRange[1]).format("YYYY-MM-DD")
      ).then((res) => {
        setBankAndCashAccounts(res);

        setSelectedData(
          selectedData
            ? res.find((aa) => aa.PayCode === selectedData.PayCode)
            : res[0]
        );
      });
    }
  }, [props.IsCashFlow, dateRange]);

  useEffect(() => {
    dispatch(
      setFormCaption(
        props.TranType === "CASH" ? 118 : props.TranType === "BANK" ? 119 : ""
      )
    );
  }, [props.TranType]);

  const legends = [
    {
      name: "Receipt",
      color: "#7F8C8D",
      key: "RCT",
    },
    {
      name: "Payment",
      color: "#9B59B6",
      key: "PMT",
    },
    {
      name: "Income",
      color: "#3498DB",
      key: "INC",
    },
    {
      name: "Expenses",
      color: "#45B39D",
      key: "EXPS",
    },
    {
      name: "Transfer",
      color: "#F4D03F",
      key: "TRNFR",
    },
    {
      name: "Adjustment",
      color: "#EB984E",
      key: "ADJS",
    },
    {
      name: "Cheque",
      color: "#E74C3C",
      key: "CHQ",
    },
    {
      name: "Opening",
      color: "#4e32a8",
      key: "OPNBAL",
    },
  ];
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Card>
          <div style={{ display: "flex" }}>
            {legends.map((aa, ss) => {
              return (
                <Fragment key={ss}>
                  <BankAndCashBookLegends name={aa.name} color={aa.color} />
                </Fragment>
              );
            })}
          </div>
          <div style={{ display: "flex" }}>
            <Button
              type=""
              icon={<SyncOutlined />}
              style={{ marginRight: 5 }}
              shape="circle"
              size="small"
              onClick={() => {
                let tempdateRange = dateRange;
                setIsLoading(true);
                setDateRange([]);
                setTimeout(() => {
                  setDateRange([...tempdateRange]);
                  setIsLoading(false);
                }, 100);
              }}
              loading={loading}
            />
            <RangePicker
              // size={"small"}
              value={dateRange}
              format={"DD/MM/YYYY"}
              onChange={(dates) => {
                setDateRange(dates);
              }}
              size="small"
            />
          </div>
        </Card>
        <div style={{ display: "flex", flex: 1 }}>
          <div style={{ width: 320 }}>
            {bankAndCashAccounts &&
              bankAndCashAccounts.map((row, aa) => {
                return (
                  <BankComponent
                    key={aa}
                    data={row}
                    selectedData={selectedData}
                    onRowSelect={() => {
                      setSelectedData(row);
                    }}
                  />
                );
              })}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "85vh",
                marginLeft: 8,
              }}
            >
              <div>
                {selectedData && (
                  <BankComponent
                    data={selectedData}
                    selectedData={selectedData}
                    isHeader={true}
                    IsAllowTransfer={hasRightToBeUsedNext(
                      l_ModuleRights.Rights,
                      "TRNFR"
                    )}
                    IsAllowAdjustment={hasRightToBeUsedNext(
                      l_ModuleRights.Rights,
                      "ADJS"
                    )}
                    refrehPage={() => {
                      let tempdateRange = dateRange;
                      setIsLoading(true);
                      setDateRange([]);
                      setTimeout(() => {
                        setDateRange([...tempdateRange]);
                        setIsLoading(false);
                      }, 100);
                    }}
                    PrintStatus={PrintStatus}
                    onPrintClick={() => {
                      setPrintStatus(true);
                      let dataType = "pdf";
                      if (window.electron) {
                        dataType = "html";
                      }
                      getBankandCashBookStatementPdf(
                        CompCode,
                        selectedData.PayCode,
                        dateRange !== null && dateRange.length > 0
                          ? moment(dateRange[0]).format("YYYY-MM-DD")
                          : null,
                        dateRange !== null && dateRange.length > 0
                          ? moment(dateRange[1]).format("YYYY-MM-DD")
                          : null,
                        dataType
                      ).then((res) => {
                        if (res) {
                          PrintPdfOrFromElectron(
                            res,
                            `${props.PayCode}`,
                            dataType
                          );

                          setPrintStatus(false);
                        }
                      });
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                {selectedData && (
                  <BankAndCashBookTableDetail
                    legends={legends}
                    PayCode={selectedData.PayCode}
                    FromDate={
                      dateRange !== null && dateRange.length > 0
                        ? moment(dateRange[0]).format("YYYY-MM-DD")
                        : null
                    }
                    ToDate={
                      dateRange !== null && dateRange.length > 0
                        ? moment(dateRange[1]).format("YYYY-MM-DD")
                        : null
                    }
                    refreshClick={() => {
                      let tempdateRange = dateRange;
                      setIsLoading(true);
                      setDateRange([]);
                      setTimeout(() => {
                        setDateRange([...tempdateRange]);
                        setIsLoading(false);
                      }, 100);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  padding: 5px;
  height: 100%;
  border-radius: 5px;
  background-color: #f0eee4;
  display: flex;
  justify-content: space-between;
`;

export default BankAndCashBook;
