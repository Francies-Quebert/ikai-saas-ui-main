import React, { useState, useEffect } from "react";
import { Tooltip, Table, Button, Typography, Modal } from "antd";
import {
  invDeleteAdjustment,
  invGetDataINVAllTranDocView,
  invDeletePurchaseInvoice,
} from "../../../services/inventory";
import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { updtCheque_Deposit_Witdraw_ReOpen } from "../../../services/payModeMaster";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { hasRightToBeUsedNext } from "../../../shared/utility";
const { confirm } = Modal;

const INVAllTranDocViewComponent = (props) => {
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  const [tranDocViewData, setTranDocViewData] = useState([]);
  const { Text } = Typography;
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const currTran = useSelector((state) => state.currentTran.moduleRights);
  const l_ConfigDateTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTTMFORMAT")
  );
  const [isLoading, setIsLoading] = useState(false);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const l_ConfigShowTransactionSummary = useSelector((state) =>
    state.AppMain.appconfigs.find(
      (kk) => kk.configCode === "SHOW_TRAN_LIST_SUMM"
    )
  );

  function sum() {
    let total = 0;
    tranDocViewData.forEach((aa) => {
      total = parseFloat(aa.TranAmount) + parseFloat(total);
    });
    return total.toFixed(3);
  }

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setIsLoading(true);

    if (props.viewParam) {
      invGetDataINVAllTranDocView(
        CompCode,
        props.viewParam.TranType,
        props.viewParam.FromDate,
        props.viewParam.ToDate,
        props.viewParam.RefCode,
        props.viewParam.CurrentUserName
      ).then((res) => {
        // console.log(res, "data");
        let tempData = [];
        res.forEach((element, inx) => {
          tempData.push({ ...element, key: element.TranId, SrNo: inx + 1 });
        });
        setTranDocViewData(tempData);
        // console.log(tempData);
        setIsLoading(false);
      });
    }
    return () => {};
  }, [props.viewParam]);

  const columns = [
    {
      title: "#",
      dataIndex: "SrNo",
      width: 50,
      key: "SrNo",
      align: "center",
    },
    {
      title: "Tran.No",
      dataIndex: "TranNo",
      width: 120,
    },
    {
      title: "Ref No",
      dataIndex: "RefNo",
      align: "center",
      width: 90,
    },
    {
      title: "Ref Date",
      dataIndex: "RefDate",
      align: "center",
      width: 90,
      render: (text, record) => {
        return (
          <>
            <span>
              {record.RefDate
                ? moment(record.RefDate).format(l_ConfigDateFormat.value1)
                : null}
            </span>
          </>
        );
      },
    },
    {
      title: "Tran Date",
      dataIndex: "TranDate",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <span>
              {moment(record.TranDate).format(l_ConfigDateFormat.value1)}
            </span>
          </>
        );
      },
    },
    {
      title:
        props.viewParam.TranType === "ADJS" ||
        props.viewParam.TranType === "REPRO"
          ? "Reason"
          : "Name",
      dataIndex: "RefDesc",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "TranAmount",
      align: "right",
      width: 100,
      render: (txt, record) => {
        return (
          <span style={{ fontWeight: 500 }}>
            {record.TranAmount ? parseFloat(record.TranAmount).toFixed(2) : ""}
          </span>
        );
      },
    },
    {
      title: "Remark",
      dataIndex: "Remark",
      ellipsis: true,
      // render: (txt, record) => {
      //   return (
      //     <>
      //       <Text ellipsis>{record.Remark}</Text>
      //     </>
      //   );
      // },
    },
    {
      title: "LastModified On",
      dataIndex: "LastModifiedOn",
      align: "right",
      width: 150,
      render: (text, record) => {
        return (
          <>
            <span>
              {moment(record.LastModifiedOn).format(
                l_ConfigDateTimeFormat.value1
              )}
            </span>
          </>
        );
      },
    },
    {
      title: "LastModified By",
      dataIndex: "LastModifiedBy",
      width: 130,
    },
    {
      title: "",
      width: 100,
      dataIndex: "x",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              style={{ padding: 2 }}
              onClick={() => {
                props.onViewClick({ visible: true, TranId: record.TranId });
              }}
              disabled={!hasRightToBeUsedNext(currTran, "VIEW")}
            >
              <Tooltip placement="top" title="Show Detail">
                <EyeOutlined className="custom-day-book-icon" />
              </Tooltip>
            </Button>
            {props.isDownload && (
              <a
                style={{ padding: 2 }}
                onClick={() => {
                  props.onDownloadPdf(record);
                }}
              >
                <Tooltip placement="top" title="Download">
                  <DownloadOutlined className="custom-day-book-icon" />
                </Tooltip>
              </a>
            )}
            {props.isEdit && (
              <Button
                type="link"
                style={{ padding: 2 }}
                onClick={() => {
                  props.onEditPress(record);
                }}
                disabled={!hasRightToBeUsedNext(currTran, "EDIT")}
              >
                <Tooltip placement="top" title="Edit">
                  <EditOutlined className="custom-day-book-icon" />
                </Tooltip>
              </Button>
            )}
            {props.isAllowDelete === true && (
              <Button
                type="link"
                style={{ padding: 2 }}
                disabled={!hasRightToBeUsedNext(currTran, "DELETE")}
                onClick={() => {
                  confirm({
                    title: "Do you want to delete this transaction?",
                    icon: <ExclamationCircleOutlined />,
                    content:
                      "When clicked the OK button, The Document will be deleted.",
                    onOk() {
                      props.onDeletePress(record);
                    },
                    onCancel() {},
                  });
                }}
              >
                <Tooltip placement="top" title="Delete">
                  <DeleteOutlined style={{ color: "red" }} />
                </Tooltip>
              </Button>
            )}
          </>
        );
      },
    },
  ];
  return (
    <div className="relative">
      <Table
        loading={isLoading}
        columns={columns.filter((ii) =>
          props.viewParam.TranType === "ADJS" ||
          props.viewParam.TranType === "REPRO"
            ? ii.dataIndex !== "TranAmount" && ii.dataIndex !== "RefNo"
            : props.viewParam.TranType !== "PUR"
            ? ii.dataIndex !== "RefNo"
            : true
        )}
        bordered
        pagination={false}
        dataSource={tranDocViewData}
        className="custom-pagination"
      />
      {l_ConfigShowTransactionSummary &&
        l_ConfigShowTransactionSummary.value1 === "Y" &&
        tranDocViewData.length > 0 && (
          <div
            className="bg-white px-2 py-1 mt-1"
            style={{
              display: "flex",
            }}
          >
            <div className="mr-4">
              Count :{" "}
              <span className="font-semibold">{tranDocViewData.length}</span>
            </div>
            <div>
              Total :{" "}
              <span className="font-semibold">
                {l_ConfigCurrency.value1} {sum()}
              </span>
            </div>
          </div>
        )}
    </div>
  );
};

export default INVAllTranDocViewComponent;
