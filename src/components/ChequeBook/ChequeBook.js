import React, { useState, useEffect } from "react";
import { DatePicker, Space, Button } from "antd";
import {
  fetchDataBankWalletGatewayBook,
  fetchDataChequeSettlement,
} from "../../services/payModeMaster";
import ChequeBookTableDetails from "./component/ChequeBookTableDetails";
import moment from "moment";
import ChequeBookHeader from "./component/ChequeBookHeader";
import HeaderComponent from "../BankAndCashBook/components/HeaderComponent";
import styled from "styled-components";
import BankAndCashBookLegends from "../BankAndCashBook/components/BankAndCashBookLegends";
import { Fragment } from "react";
import {
  LoadingOutlined,
  PoweroffOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../store/actions/currentTran";
import { hasRightToBeUsedNext } from "../../shared/utility";

const { RangePicker } = DatePicker;

const ChequeBook = () => {
  const dispatch = useDispatch();
  const [bankAndCashAccounts, setBankAndCashAccounts] = useState();
  const [dateRange, setDateRange] = useState([moment(), moment()]);
  const [selectedData, setSelectedData] = useState();
  const [loading, setIsLoading] = useState(false);
  const [loadingData, setIsLoadingData] = useState(false);
  const l_ModuleRights = useSelector((state) =>
    state.AppMain.userAccess.find((oo) => oo.ModuleId === 122)
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
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

  const [data, setData] = useState([]);
  const [calcAmount, setCalcAmount] = useState({
    issued: 0,
    received: 0,
    total: 0,
  });
  useEffect(() => {
    dispatch(setFormCaption(122));
  }, []);
  useEffect(() => {
    if (dateRange && dateRange !== null && dateRange.length > 0) {
      setIsLoadingData(true);
      fetchDataChequeSettlement(
        CompCode,
        moment(dateRange[0]).format("YYYY-MM-DD"),
        moment(dateRange[1]).format("YYYY-MM-DD")
      )
        .then((res) => {
          let issue = 0;
          let receive = 0;
          setData(res);
          res
            .filter((aa) => aa.AllowReOpen === "N")
            .map((aa) => {
              if (aa.DepositOrWithdraw === "D") {
                receive += parseFloat(aa.Amount);
              } else {
                issue += Math.abs(parseFloat(aa.Amount));
              }
            });
          setCalcAmount({
            issued: issue,
            received: receive,
            total: issue - receive,
          });
          setIsLoadingData(false);
        })
        .catch(() => {
          setIsLoadingData(false);
        });
    } else {
      setData([]);
    }
  }, [dateRange]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Card>
          <div style={{ display: "flex" }}>
            {legends.map((aa) => {
              return (
                <Fragment key={aa.key}>
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
        <div>
          {/* {selectedData && ( */}
          <ChequeBookHeader
            data={{ PaymentType: "CHQ", PayDesc: "Cheque" }}
            selectedData={selectedData}
            isHeader={true}
            calcAmount={calcAmount}
            refrehPage={() => {
              let tempdateRange = dateRange;
              setIsLoading(true);
              setDateRange([]);
              setTimeout(() => {
                setDateRange([...tempdateRange]);
                setIsLoading(false);
              }, 100);
            }}
          />
          {/* )} */}
        </div>
        <div style={{ flex: 1 }}>
          {/* {selectedData && ( */}
          <ChequeBookTableDetails
            IsReOpenAllowed={hasRightToBeUsedNext(
              l_ModuleRights.Rights,
              "REOPEN"
            )}
            IsDepositAllowed={hasRightToBeUsedNext(
              l_ModuleRights.Rights,
              "DEPOSIT"
            )}
            IsWithdrawAllowed={hasRightToBeUsedNext(
              l_ModuleRights.Rights,
              "WITHDRAW"
            )}
            legends={legends}
            PayCode={"CHQ"}
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
            data={data}
            refrehPage={() => {
              let tempdateRange = dateRange;
              setIsLoading(true);
              setDateRange([]);
              setTimeout(() => {
                setDateRange([...tempdateRange]);
                setIsLoading(false);
              }, 100);
            }}
          />
          {/* )} */}
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

export default ChequeBook;
