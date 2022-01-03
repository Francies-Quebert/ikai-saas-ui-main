import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Typography,
  Button,
  Empty,
  Table,
  Spin,
  Select,
  DatePicker,
  Skeleton,
} from "antd";
import {
  RetweetOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  FileOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { setFormCaption } from "../../../store/actions/currentTran";
import { fetchUserMasters } from "../../../store/actions/usermaster";
import { getBillSettlementData } from "../../../services/cust-outstanding";
import Settlement from "./Settlement/Settlement";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { getInvoicePdf } from "../../../services/service-managment/service-management";
import fileDownload from "js-file-download";
import { PrintPdfOrFromElectron } from "../../../shared/utility";

const BillSettlement = () => {
  const dispatch = useDispatch();
  const { Option } = Select;
  const { Text } = Typography;
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const currentTran = useSelector((state) => state.currentTran);
  const customer = useSelector((state) => state.userMaster.customerMasters);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [editedData, setEditedData] = useState();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();

  useEffect(() => {
    if (currentTran.isSuccess) {
      fnSetDefault();
    }
  }, [currentTran.isSuccess]);

  useEffect(() => {
    dispatch(setFormCaption(78));
    dispatch(fetchUserMasters("U"));
    fnSetDefault();
  }, []);

  const fnSetDefault = () => {
    setIsLoading(true);
    try {
      if (query.get("CustId") !== null) {
        getBillSettlementData(CompCode, null, null, query.get("CustId")).then(
          (res) => {
            setData(res);
            setSelectedUserId(parseInt(query.get("CustId")));
          }
        );
      } else {
        getBillSettlementData(CompCode, null, null, null).then((res) => {
          setData(res);
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Invoice No.",
      //   key: "InvoiceNo",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>{record.InvoiceNo} </Text>
          </>
        );
      },
    },
    {
      title: "Invoice Date",
      //   key: "InvoiceNo",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>
              {moment(record.InvoiceDate).format(l_ConfigDateFormat.value1)}
            </Text>
          </>
        );
      },
    },
    {
      title: "Customer Name",
      key: "Customer",

      align: "center",
      render: (value, record, index) => {
        return (
          <>
            <Text>
              {record.Name} ({record.mobile})
            </Text>
          </>
        );
      },
    },
    {
      title: "Invoice Amount",
      width: 130,
      align: "right",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseFloat(record.InvoiceAmount).toFixed(2)}</Text>
          </>
        );
      },
    },
    {
      title: "Settlement Amount",
      width: 150,
      align: "right",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseFloat(record.SettlementAmount).toFixed(2)}</Text>
          </>
        );
      },
    },
    {
      title: "Balance Amount",
      width: 130,
      align: "right",
      render: (value, record, index) => {
        return (
          <>
            <Text>{parseFloat(record.BalanceAmount).toFixed(2)}</Text>
          </>
        );
      },
    },

    {
      title: "",
      width: 220,
      align: "center",
      render: (value, record, index) => {
        return (
          <div>
            <Button
              style={{ marginRight: 5 }}
              // size="small"
              type="primary"
              icon={<FileOutlined />}
              onClick={() => {
                setEditedData(record);
              }}
            >
              Settle
            </Button>
            <Button
              // size="small"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => {
                let dataType = "pdf";
                if (window.electron) {
                  dataType = "html";
                }
                getInvoicePdf(CompCode, true, record.InvoiceId, dataType).then(
                  (res) => {
                    PrintPdfOrFromElectron(
                      res,
                      `#${record.InvoiceNo}`,
                      dataType
                    );
                  }
                );
              }}
            >
              Invoice
            </Button>
          </div>
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
            <Select
              allowClear={true}
              showSearch
              style={{ width: 300, marginRight: 10 }}
              placeholder={"Select Customer"}
              value={selectedUserId}
              onChange={(value) => setSelectedUserId(value)}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toString().toLowerCase()) >= 0
              }
            >
              {customer.length > 0 &&
                customer.map((item) => {
                  return (
                    <Option
                      key={item.userId}
                      value={item.userId}
                    >{`${item.Name} (${item.mobile})`}</Option>
                  );
                })}
            </Select>

            <Button
              type="primary"
              htmlType="submit"
              //   disabled={(!fromDate || !toDate) && !selectedUserId}
              icon={<SearchOutlined />}
              style={{ marginRight: 10, marginBottom: 5 }}
              onClick={() => {
                setIsLoading(true);
                getBillSettlementData(
                  CompCode,
                  fromDate ? fromDate.format("YYYY-MM-DD") : null,
                  toDate ? toDate.format("YYYY-MM-DD") : null,
                  selectedUserId ? selectedUserId : null
                ).then((res) => {
                  setData(res);
                });
                setIsLoading(false);
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
                setSelectedUserId();
                fnSetDefault();
              }}
            >
              Reset
            </Button>

            <Card bodyStyle={{ marginTop: 10, padding: 0 }} bordered={false}>
              {data && data.length > 0 ? (
                <Table
                  columns={columns}
                  bordered={true}
                  dataSource={data}
                  pagination={{ pageSize: 20 }}
                />
              ) : (
                <Empty />
              )}
            </Card>
          </Card>
        )}

        {editedData && (
          <Settlement
            data={editedData}
            onBackPress={() => {
              setEditedData();
            }}
            settlementType="INVOICE"
          />
        )}
      </Spin>
    </div>
  );
};

export default BillSettlement;
