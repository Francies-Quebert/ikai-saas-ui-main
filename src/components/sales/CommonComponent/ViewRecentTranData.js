import {
  PrinterOutlined,
  PrinterTwoTone,
  LoadingOutlined,
  PrinterFilled,
} from "@ant-design/icons";
import React, { Fragment, useEffect, useState } from "react";

const ViewRecentTranData = (props) => {
  const [Amount, setAmount] = useState({ amountPaid: 0, returned: 0 });
  useEffect(() => {
    let amountPaid, returned;
    // console.log(props.dtlData.length);
    if (props.dtlData.length === 1 && props.dtlData[0].PaymentMode !== "CASH") {
      amountPaid = props.hdrData.Amount;
      returned = 0;
    } else {
      amountPaid = props.hdrData.amountPaid;
      returned = props.hdrData.amountPaid - props.hdrData.Amount;
    }
    setAmount({ amountPaid: amountPaid, returned: returned });
  }, []);

  return (
    // <Fragment key={props.hdrData.InvoiceId}>
    //   <div className="p-1 sales-recent-card">
    //     <div className="d-flex">
    //       <div className="flex-1">
    //         <div className="sales-recent-vno">
    //           #{props.stlmntData.VoucherNo}
    //         </div>
    //         <div className="sales-recent-date-time">
    //           {props.hdrData.currentTime}
    //         </div>
    //       </div>
    //       <div className="flex-1 font-size-10">
    //         <div className="d-flex justify-center">
    //           <div className="sales-recent-amt-paid">Amount Paid</div>
    //           <div className="sales-recent-amt-paid-curr">
    //             ₹ {props.hdrData.amountPaid}
    //           </div>
    //         </div>
    //         <div className="d-flex justify-center">
    //           <div className="sales-recent-amt-paid">Returned</div>
    //           <div style={{ color: "#000" }}>
    //             ₹ {props.hdrData.amountPaid - props.hdrData.Amount}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="d-flex">
    //       <div className="flex-1 sales-recent-customer">
    //         {props.hdrData.customerName}
    //       </div>
    //       <div className="flex-1 d-flex justify-center">
    //         <div
    //           className="sales-recent-btn mr-1 show-pointer"
    //           onClick={() => {
    //             props.onReprintClick();
    //           }}
    //         >
    //           <div className="sales-recent-btn-inner">Reprint</div>
    //         </div>
    //         <div className="sales-recent-btn">
    //           <div className="sales-recent-btn-inner sales-btn-green">
    //             ₹ {props.hdrData.Amount}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </Fragment>

    <Fragment key={props.hdrData.InvoiceId}>
      <div className={` d-flex justify-between  sales-recent-card mb-1 `}>
        <div className="p-1.5 flex-1 d-flex justify-between">
          <div>
            <div className="sales-recent-vno">
              #{props.stlmntData.VoucherNo}
            </div>
            <div className="sales-recent-date-time">
              {props.hdrData.currentTime}
            </div>
            <div className="sales-recent-customer">
              {props.hdrData.customerName}
            </div>
          </div>
          <div
            className="text-2xl font-extrabold self-center "
            style={{ color: "var(--app-theme-color)" }}
          >
            ₹ {props.hdrData.amountPaid}
          </div>
        </div>
        <div
          className="p-1.5 d-flex items-center text-2xl border-l-2 border-gray-600 cursor-pointer"
          onClick={() => props.onReprintClick()}
        >
          {/* <PrinterFilled /> */}
          <PrinterTwoTone />
        </div>
      </div>
    </Fragment>
  );
};

export default ViewRecentTranData;
