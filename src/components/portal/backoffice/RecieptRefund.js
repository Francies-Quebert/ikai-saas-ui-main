import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../store/actions/currentTran";
import {
  Card,
  DatePicker,
  Button,
  Empty,
  Table,
  Spin,
  Input,
  Typography,
  Popconfirm,
} from "antd";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  DeleteTwoTone,
  EditTwoTone,
} from "@ant-design/icons";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import { fetchPaymodeMaster } from "../../../store/actions/paymodemaster";
import { hasRight, sysGenCode } from "../../../shared/utility";
import { fetchSequenceNextVal } from "../../../store/actions/sys-sequence-config";
import moment from "moment";
import {
  getRecieptRefundHdrData,
  DeleteRefund,
} from "../../../services/reciept-refund";
import { toast } from "react-toastify";
import RefundHdrCard from "./RecieptRefund/RefundHdrCard";
const { Text } = Typography;

const RecieptRefund = () => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [fromDate, setFromDate] = useState();
  const [refundNo, setRefundNo] = useState(null);
  const [toDate, setToDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [refundHdrData, setRefundHdrData] = useState([]);
  const [editedData, setEditedData] = useState();
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const currentTran = useSelector((state) => state.currentTran);
  const sysConfig = useSelector((state) => state.AppMain.sysSequenceConfig);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(setFormCaption(74));
    dispatch(fetchUserMasters("U"));
    dispatch(fetchPaymodeMaster());
    fnSetDefault();
  }, []);

  const fnSetDefault = () => {
    setIsLoading(true);
    try {
      getRecieptRefundHdrData(
        CompCode,
        fromDate
          ? fromDate.format("YYYY-MM-DD")
          : moment(new moment()).format("YYYY-MM-DD"),
        toDate
          ? toDate.format("YYYY-MM-DD")
          : moment(new moment()).format("YYYY-MM-DD"),
        refundNo ? refundNo : null
      ).then((res) => {
        setRefundHdrData(res);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentTran.isSuccess) {
      toast.success("Data saved successfully...!");
      fnSetDefault();
    }
  }, [currentTran.isSuccess]);

  const handleDelete = (record) => {
    const newData = [...refundHdrData];
    newData[newData.findIndex((ii) => ii.key === record.key)] = record;
    setRefundHdrData([...newData]);
    dispatch(DeleteRefund(record));
  };

  const columns = [
    {
      align: "center",
      title: "Refund Id",
      dataIndex: "RefundId",
      key: "key",
      width: "8%",
    },
    {
      title: "Refund No.",
      dataIndex: "RefundNo",
      width: "12%",
      align: "center",
    },
    {
      title: "Refund Date",
      dataIndex: "RefundDate",
      align: "center",
      width: "10%",
      render: (value, record) => {
        return (
          <Text>
            {moment(record.RefundDate).format(l_ConfigDateFormat.value1)}
          </Text>
        );
      },
    },
    {
      title: "Receipt No.",
      dataIndex: "ReceiptNo",
      width: "12%",
      align: "center",
    },
    {
      title: "Customer Name",
      align: "center",
      width: "20%",
      render: (value, record) => {
        return record.RefundType === "CUST"
          ? customer &&
              customer
                .filter((i) => i.userId === parseInt(record.Value1))
                .map((ii) => {
                  return (
                    <Text key={ii.userId}>
                      {ii.Name} ({ii.mobile})
                    </Text>
                  );
                })
          : null;
      },
    },
    {
      title: "Remark",
      dataIndex: "Remark",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      align: "center",
      width: "10%",
    },
    {
      align: "center",
      dataIndex: "",
      key: "x",
      width: "6%",
      render: (text, record) => {
        return (
          <>
            <a
              href="#"
              className={`edit-btn ${
                hasRight(currentTran.moduleRights, "EDIT")
                  ? `disabled`
                  : `edit-btn`
              }`}
              disabled={hasRight(currentTran.moduleRights, "EDIT")}
              style={{ marginRight: 10 }}
            >
              <span
                onClick={() => {
                  setEditedData({ entrymode: "E", data: record });
                }}
              >
                <EditTwoTone />
              </span>
            </a>
            <Popconfirm
              title="Are you sure delete ?"
              onConfirm={() => {
                record.isDeleted = true;
                handleDelete(record);
              }}
              okText="Yes"
              cancelText="No"
            >
              <a
                className={`edit-btn ${
                  hasRight(currentTran.moduleRights, "DELETE")
                    ? `disabled`
                    : `edit-btn`
                }`}
                disabled={hasRight(currentTran.moduleRights, "DELETE")}
              >
                <DeleteTwoTone />
              </a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        {!isLoading && !editedData && (
          <Card bodyStyle={{ padding: 10 }}>
            <DatePicker
              style={{
                marginRight: 10,
                marginBottom: 5,
                width: "calc(17% - 8px)",
              }}
              value={fromDate}
              format={l_ConfigDateFormat.value1}
              onChange={(evt) => {
                setFromDate(evt);
              }}
              placeholder="Select From Date"
            />

            <DatePicker
              style={{
                marginRight: 10,
                marginBottom: 5,
                width: "calc(17% - 8px)",
              }}
              format={l_ConfigDateFormat.value1}
              value={toDate}
              onChange={(evt) => {
                setToDate(evt);
              }}
              placeholder="Select To Date"
            />

            <Input
              allowClear
              style={{ marginRight: 10, width: "calc(17% - 8px)" }}
              value={refundNo}
              placeholder="Input refund no."
              onChange={(e) => setRefundNo(e.target.value)}
            />

            <Button
              type="primary"
              htmlType="submit"
              disabled={(!fromDate || !toDate) && !refundNo}
              icon={<SearchOutlined />}
              style={{ marginRight: 10, marginBottom: 5 }}
              onClick={() => {
                getRecieptRefundHdrData(
                  CompCode,
                  fromDate ? fromDate.format("YYYY-MM-DD") : null,
                  toDate ? toDate.format("YYYY-MM-DD") : null,
                  refundNo ? refundNo : null
                ).then((res) => {
                  setRefundHdrData(res);
                });
              }}
            >
              Search
            </Button>

            <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 10, marginBottom: 5 }}
              onClick={() => {
                setFromDate();
                setToDate();
              }}
            >
              Reset
            </Button>
            <Button
              disabled={hasRight(currentTran.moduleRights, "ADD")}
              type="primary"
              icon={<PlusCircleOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                setEditedData({ entrymode: "A" });
                if (sysGenCode(sysConfig, "RFND")) {
                  dispatch(fetchSequenceNextVal("RFND"));
                }
              }}
            >
              Create New Reciept Refund
            </Button>
            <Card bodyStyle={{ marginTop: 10, padding: 0 }} bordered={false}>
              {refundHdrData.length === 0 && <Empty />}
              {refundHdrData.length > 0 && (
                <Table
                  columns={columns}
                  bordered={true}
                  dataSource={refundHdrData.filter((i) => !i.isDeleted)}
                  pagination={{ pageSize: 20 }}
                />
              )}
            </Card>
          </Card>
        )}
        {editedData && (
          <>
            <RefundHdrCard
              onBackPress={() => setEditedData()}
              entryMode={editedData.entrymode}
              formData={editedData.data}
            />
          </>
        )}
      </Spin>
    </div>
  );
};

export default RecieptRefund;
