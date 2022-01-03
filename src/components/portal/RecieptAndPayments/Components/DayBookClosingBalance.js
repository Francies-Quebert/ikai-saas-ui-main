import React, { useState, useEffect } from "react";
import { fetchDataCashBankSummary } from "../../../../services/payModeMaster";
import { useSelector } from "react-redux";
import moment from "moment";
import IMG_BANK from "../../../../icons/bank.png";
import IMG_GATEWAY from "../../../../icons/gateway.png";
import IMG_WALLET from "../../../../icons/wallet.png";
import IMG_CASH from "../../../../icons/cash.png";
import IMG_CHQ from "../../../../icons/cheque.png";
const DayBookClosingBalance = ({ TranDate, key, IsRefresh }) => {
  const [closingBalance, setClosingBalance] = useState();
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  useEffect(() => {
    fetchDataCashBankSummary(
      CompCode,
      moment(TranDate).format("YYYY-MM-DD")
    ).then((res) => {
      setClosingBalance(res);
    });
  }, []);

  useEffect(() => {
    fetchDataCashBankSummary(
      CompCode,
      moment(TranDate).add(0, "d").format("YYYY-MM-DD")
    ).then((res) => {
      setClosingBalance(res);
    });
  }, [IsRefresh, TranDate]);

  return (
    <div key={key} className="flex px-2 pt-1">
      <div className="py-1 px-2 border-r-2 border-primary-light">
        <div className="text-primary-color font-semibold">Cash &amp; Bank</div>
        <div className="text-primary-color font-semibold">Closing Balance</div>
      </div>
      <div className="flex py-1 px-2 flex-d-row flex-wrap">
        {closingBalance &&
          closingBalance.map((cb, idx) => {
            // console.log(cb);
            return (
              <div className="py-1 px-2" key={idx}>
                <div className="flex justify-between text-primary-color font-semibold border-b-2 border-primary-light">
                  <img
                    className="w-7 pr-2   "
                    src={
                      cb.PaymentType === "BANK"
                        ? IMG_BANK
                        : cb.PaymentType === "WALLET"
                        ? IMG_WALLET
                        : cb.PaymentType === "GATEWAY"
                        ? IMG_GATEWAY
                        : cb.PaymentType === "CASH"
                        ? IMG_CASH
                        : cb.PaymentType === "CHEQUE"
                        ? IMG_CHQ
                        : null
                    }
                  />
                  {cb.PayDesc}{" "}
                </div>
                <div className="text-primary-color font-semibold text-right ">
                  {l_ConfigCurrency.value1}{" "}
                  {cb.ClosingBalance ? parseFloat(cb.ClosingBalance) : "-"}
                </div>
              </div>
            );
          })}
      </div>

      {/* <div className="text-primary-color ">
        <span className="font-semibold">Closing Balance</span> (Closing Balance
        as of {moment(TranDate).format(l_ConfigDateFormat.value1)})
      </div>
      <div className="font-semibold">
        {closingBalance && closingBalance.ClosingBalance}
      </div> */}
    </div>
  );
};

export default DayBookClosingBalance;
