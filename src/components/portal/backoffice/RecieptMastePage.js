import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFormCaption,
  reInitialize,
} from "../../../store/actions/currentTran";
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
  message,
} from "antd";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  DeleteTwoTone,
  EditTwoTone,
} from "@ant-design/icons";
import { getRecieptHdrData, DeleteReciept } from "../../../services/reciept";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import RecieptCard from "./Reciept/RecieptCard";
import { hasRight, sysGenCode } from "../../../shared/utility";
import { fetchPaymodeMaster } from "../../../store/actions/paymodemaster";
import { toast } from "react-toastify";
import { fetchSequenceNextVal } from "../../../store/actions/sys-sequence-config";
import moment from "moment";
const { Text } = Typography;

const RecieptMastePage = () => {
  const dispatch = useDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState();
  const [recieptNo, setRecieptNo] = useState(null);
  const [toDate, setToDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [cardData, setCardData] = useState();
  const sysConfig = useSelector((state) => state.AppMain.sysSequenceConfig);
  const currentTran = useSelector((state) => state.currentTran);

  useEffect(() => {
    dispatch(setFormCaption(73));
    dispatch(fetchUserMasters("U"));
    dispatch(fetchPaymodeMaster());
    fnSetDefault();
  }, []);

  const disableAction = (record) => {
    return moment(new moment()).format("YYYY-MM-DD") !==
      moment(record.ReceiptDate).format("YYYY-MM-DD")
      ? true
      : false;
  };

  const fnSetDefault = () => {
    setIsLoading(true);
    try {
      getRecieptHdrData(
        CompCode,
        fromDate
          ? fromDate.format("YYYY-MM-DD")
          : moment(new moment()).format("YYYY-MM-DD"),
        toDate
          ? toDate.format("YYYY-MM-DD")
          : moment(new moment()).format("YYYY-MM-DD"),
        recieptNo ? recieptNo : null
      ).then((res) => {
        setData(res);
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
    const newData = [...data];
    newData[newData.findIndex((ii) => ii.key === record.key)] = record;
    setData([...newData]);
    dispatch(DeleteReciept(record));
  };

  const columns = [
    {
      align: "center",
      title: "Reciept Id",
      dataIndex: "ReceiptId",
      key: "key",
      width: "8%",
    },
    {
      title: "Reciept No.",
      dataIndex: "ReceiptNo",
      width: "12%",
      align: "center",
    },
    {
      title: "Receipt Date",
      dataIndex: "ReceiptDate",
      align: "center",
      width: "10%",
      render: (value, record) => {
        return (
          <Text>
            {moment(record.ReceiptDate).format(l_ConfigDateFormat.value1)}
          </Text>
        );
      },
    },
    {
      title: "Customer Name",
      align: "center",
      width: "20%",
      render: (value, record) => {
        return record.ReceiptType === "CUST"
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
      width: "5%",
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
                  setCardData({ entrymode: "E", data: record });
                }}
              >
                <EditTwoTone />
              </span>
            </a>
            <Popconfirm
              title="Are you sure delete ?"
              onConfirm={() => {
                if (record.Amount === record.BalAmount) {
                  record.isDeleted = true;
                  handleDelete(record);
                } else {
                  message.error("Your Acount has been settled");
                }
              }}
              okText="Yes"
              cancelText="No"
            >
              <a
                className={`edit-btn ${
                  hasRight(currentTran.moduleRights, "DELETE") ||
                  disableAction(record)
                    ? `disabled`
                    : `edit-btn`
                }`}
                disabled={
                  hasRight(currentTran.moduleRights, "DELETE") ||
                  disableAction(record) ||
                  record.Amount !== record.BalAmount
                }
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
        {!isLoading && !cardData && (
          <Card bodyStyle={{ padding: 10 }}>
            <DatePicker
              style={{
                marginRight: 10,
                marginBottom: 5,
                width: "calc(17% - 8px)",
              }}
              // defaultValue={moment(new moment())}
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
              value={recieptNo}
              placeholder="Input reciept no."
              onChange={(e) => setRecieptNo(e.target.value)}
            />

            <Button
              type="primary"
              htmlType="submit"
              disabled={(!fromDate || !toDate) && !recieptNo}
              icon={<SearchOutlined />}
              style={{ marginRight: 10, marginBottom: 5 }}
              onClick={() => {
                getRecieptHdrData(
                  CompCode,
                  fromDate ? fromDate.format("YYYY-MM-DD") : null,
                  toDate ? toDate.format("YYYY-MM-DD") : null,
                  recieptNo ? recieptNo : null
                ).then((res) => {
                  setData(res);
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
                fnSetDefault();
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
                setCardData({ entrymode: "A" });
                if (sysGenCode(sysConfig, "RCPT")) {
                  dispatch(fetchSequenceNextVal("RCPT"));
                }
              }}
            >
              Create New Reciept
            </Button>

            <Card bodyStyle={{ marginTop: 10, padding: 0 }} bordered={false}>
              {data.length === 0 && <Empty />}
              {data.length > 0 && (
                <Table
                  columns={columns}
                  bordered={true}
                  dataSource={data.filter((i) => !i.isDeleted)}
                  pagination={{ pageSize: 20 }}
                />
              )}
            </Card>
          </Card>
        )}
        {cardData && (
          <>
            <RecieptCard
              onBackPress={() => setCardData()}
              entryMode={cardData.entrymode}
              data={cardData.data}
            />
          </>
        )}
      </Spin>
    </div>
  );
};

export default RecieptMastePage;
