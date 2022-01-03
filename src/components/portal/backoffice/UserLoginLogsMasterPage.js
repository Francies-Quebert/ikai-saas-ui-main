import React, { Fragment, useState, useEffect } from "react";
// import UserLoginLogsCard from "./UserLoginLogs/UserLoginLogsMasterCard";
import UserLoginLogsCard from "./UserLoginLogs/UserLoginLogsMasterCardNew";
import { fetchUserLoginLogsMasters } from "../../../store/actions/userloginlogs";
import { setFormCaption } from "../../../store/actions/currentTran";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import CustomDataTable from "../../common/CustomDataTable";
import ColumnProperties from "../../../models/columnProperties";
// import Iframe from "react-iframe";
// import axios from "axios";
import jsreport from "jsreport-browser-client-dist";
import { Modal } from "antd";

const UserLoginLogsMasterPage = () => {
  const dispatch = useDispatch();
  const currTran = useSelector((state) => state.currentTran);
  const userloginlogs = useSelector((state) => state.userloginlogs);
  const [editedData, setEditedData] = useState();
  const [reportPreview, setReportPreview] = useState();
  // const [showRpt, setShowRpt] = useState(false);

  useEffect(() => {
    dispatch(fetchUserLoginLogsMasters());
    dispatch(setFormCaption(8));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
    }
  }, [currTran.lastSavedData]);

  return (
    <Fragment>
      <div>
        <UserLoginLogsCard
          onPrintClick={() => {
            jsreport.serverUrl = "https://hariom23shah.jsreportonline.net";
            let reportRequest = {
              template: { shortid: "H1eFKNGYbH" },
              options: { reports: { save: true } },
              data: {
                invoiceNumber: "2019-3514C",
                data: "14.7.2019",
                company: {
                    address: "U Sluncove 603 Prague",
                    email: "jan.blaha@jsreport.net",
                    phone: "776271022"
                },
                total: "295",
                items: [{
                    product: {
                        name: "Hariom Shah",
                        price: "295"            
                    },
                    cost: 295,
                    quantity: 1
                }]
            },
            };
            // jsreport.renderAsync(reportRequest).then(res => {
            //   console.log(res)
            // });

            // jsreport.render(reportPreview, reportRequest);
            // jsreport.download('myReport.pdf', reportRequest);
            jsreport.headers['Authorization'] = "Basic " + btoa("hariom23shah@gmail.com:Hariom@123")
            jsreport.renderAsync(reportRequest).then(function (res) {
              var html =
                "<html>" +
                "<style>html,body {padding:0;margin:0;} iframe {width:100%;height:100%;border:0}</style>" +
                "<body>" +
                '<iframe type="application/pdf" src="' +
                res.toDataURI() +
                '"></iframe>' +
                "</body></html>";
              var a = window.open("about:blank", "Report");
              a.document.write(html);
              a.document.close();
            });

            // setShowRpt(true);
            // axios.post(
            //   "",
            //   {
            //     template: {
            //       shortid: "0K4HIZ4",
            //     },
            //   },
            //   {
            //     auth: {
            //       username: "hariom23shah@gmail.com",
            //       password: "Hariom@123",
            //     },
            //   }
            // ).then(res => {
            //   console.log(res)
            //   console.log(res.toDataURI())
            //   setPDFData(res.data)
            // });
          }}
          onSearchClick={(fromDate, toDate) =>
            dispatch(
              fetchUserLoginLogsMasters(
                moment(fromDate).format("YYYY-MM-DD"),
                moment(toDate).format("YYYY-MM-DD")
              )
            )
          }
        />
        {!editedData && userloginlogs.userloginlogsMasters && (
          <CustomDataTable
            isInvisibleAdd={true}
            IsInVisibleAction={true}
            columnProperties={columnProperties}
            myData={userloginlogs.userloginlogsMasters}
            AllowEdit={false}
            makeActionInVisible={false}
            // onAddClick={() => {
            //   setEditedData({ entryMode: "A" });
            // }}
            // onEditPress={(values) => {
            //   setEditedData({ entryMode: "E", formData: values });
            // }}
            pageDefaultSize={15}
          />
        )}
      </div>
      {/* <div>
        <Modal
          title="Basic Modal"
          visible={showRpt}
          // onOk={this.handleOk}
          // onCancel={this.handleCancel}
        >
          <div id="reportPlaceholder">
            <p>there should be a report here...</p>
            <div
              style={{ height: "700px" }}
              ref={(el) => setReportPreview(el)}
            />
          </div>
        </Modal>
      </div> */}
    </Fragment>
  );
};

export const columnProperties = [
  new ColumnProperties("Id", true, "Id", false, 100),
  new ColumnProperties("UserType", false, "UserType", true, 90),
  new ColumnProperties("UserId", false, "UserId", true, 90),
  new ColumnProperties("Name", true, "User Name", true, 350),
  new ColumnProperties("MobileNo", true, "MobileNo", true, 200),
  new ColumnProperties("DeviceName", true, "DeviceName", true, 300),
  new ColumnProperties("ExpoDeviceId", false, "ExpoDeviceId", true, 90),
  new ColumnProperties("SystemOS", false, "SystemOS", true, 190),
  new ColumnProperties("SystemOSVerNo", false, "SystemOSVerNo", true, 90),
  new ColumnProperties("LoginDttm", true, "LoginDttm", true, 350),
  new ColumnProperties(
    "ExpoNotificationToken",
    false,
    "ExpoNotificationToken",
    true,
    90
  ),
];

export default UserLoginLogsMasterPage;
