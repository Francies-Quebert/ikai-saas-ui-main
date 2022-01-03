import React, { useState, useEffect } from "react";
import {
  invUpdateStockOutDtlMK,
  InvGenerateInvoiceMKStockOut,
  invUpdateStockOutDtlMKArchive,
} from "../../../services/inventory";
import {
  Row,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Modal,
  Button,
  Table,
  Checkbox,
  notification,
  Tooltip,
} from "antd";
import _ from "lodash";
import moment from "moment";
import {
  DownloadOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import fileDownload from "js-file-download";

const { Option } = Select;
const StockOutDtlTable = (props) => {
  const [Data, setData] = useState();
  const [IsLoading, setIsLoading] = useState(false);
  const [SelectedRow, setSelectedRow] = useState([]);
  const l_loginUser = useSelector((state) => state.LoginReducer.userData);
  const initailFetch = (record) => {
    return new Promise(async function (resolve, reject) {
      try {
        await setData([...record]);
        resolve(record);
      } catch (error) {
        reject(error);
      }
    });
  };
  useEffect(() => {
    setIsLoading(true);
    // console.log(props.record, "record");
    initailFetch(props.record.dtlData)
      .then((res) => {})
      .catch((err) => {})
      .finally(() => {
        setTimeout(async () => {
          setIsLoading(false);
        }, 100);
      });
    console.log("renders");
  }, []);

  useEffect(() => {
    if (props.renderDtlComponent === true) {
      setIsLoading(true);
      initailFetch(props.record.dtlData)
        .then((res) => {})
        .catch((err) => {})
        .finally(() => {
          setTimeout(async () => {
            setIsLoading(false);
          }, 100);
          props.renderDtlComponentRevert();
        });
      return () => {
        // console.log("dismounted");
      };
    }
    console.log("renders");
  }, [props.renderDtlComponent]);

  const columnsDtl = [
    {
      dataIndex: "x",
      width: 40,
      fixed: "left",
      render: (text, record) => {
        return (
          <Checkbox
            disabled={record.SoldStatus === "SOLD"}
            checked={SelectedRow.find((aa) => aa === record.key)}
            onChange={() => {
              let findData = SelectedRow.find((aa) => aa === record.key);
              if (!findData) {
                setSelectedRow([...SelectedRow, record.key]);
              } else {
                setSelectedRow([
                  ...SelectedRow.filter((aa) => aa !== record.key),
                ]);
              }
            }}
          />
        );
      },
    },
    { dataIndex: "ItemName", title: "Item Name", width: 160, fixed: "left" },
    { dataIndex: "Qty", title: "Qty", width: 60, fixed: "left" },
    { dataIndex: "PacketNo", title: "Packet No", width: 40 },
    { dataIndex: "Weight", title: "Weight", width: 60 },
    {
      dataIndex: "EP",
      title: "Estimated Price",
      width: 60,
      render: (text, record) => {
        return (
          <InputNumber
            value={text}
            min={0}
            placeholder="Price"
            style={{ width: "100%" }}
            disabled={record.SoldStatus === "SOLD"}
            // disabled={
            //   SelectedRow.find((ss) => ss === record.key) ? false : true
            // }
            className="bill-input"
            onChange={(e) => {
              let tempTable = Data;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].EP = e;
              if (
                !_.includes([null, undefined, "", NaN], e) &&
                !_.includes([null, undefined, "", NaN], record.Qty)
              ) {
                tempTable[findIndex].EstimatedAmount =
                  parseFloat(e) * parseFloat(record.Qty);
              } else {
                tempTable[findIndex].EstimatedAmount = 0;
              }
              tempTable[findIndex].isDirty = true;
              setData([...tempTable]);
            }}
          />
        );
      },
    },
    {
      dataIndex: "PName",
      title: "Party",
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        // console.log(record,"record")
        return (
          <div style={{ width: "100%" }}>
            <Select
              value={record.Party}
              disabled={
                SelectedRow.find((ss) => ss === record.key)
                  ? false
                  : true || record.SoldStatus === "SOLD"
              }
              placeholder="Party"
              style={{ width: "100%" }}
              // disabled={true}
              optionFilterProp="children"
              allowClear
              showSearch
              filterOption={true}
              onChange={(e, option) => {
                let tempTable = Data;
                let findIndex = tempTable.findIndex(
                  (aa) => aa.key == record.key
                );
                // tempTable[findIndex].isDirty = true;
                tempTable[findIndex].Party = e;
                tempTable[findIndex].PName = option ? option.data.Name : null;
                // console.log(option);
                setData([...tempTable]);
              }}
            >
              {props.customerMaster.map((row) => {
                return (
                  <Option key={row.UserId} value={row.UserId} data={row}>
                    {row.Name}
                  </Option>
                );
              })}
            </Select>
          </div>
        );
      },
    },
    {
      dataIndex: "DeliveryStatus",
      title: "Delivery Status",
      width: 100,
      render: (text, record) => {
        return (
          <Input
            // defaultValue={text}
            value={text}
            placeholder="Delivery Status"
            // disabled={
            //   SelectedRow.find((ss) => ss === record.key) ? false : true
            // }
            disabled={record.SoldStatus === "SOLD"}
            className="bill-input"
            // onBlur={(e) => {
            //   let tempTable = Data;
            //   let findIndex = tempTable.findIndex(
            //     (aa) => aa.key === record.key
            //   );
            //   tempTable[findIndex].isDirty = true
            //   tempTable[findIndex].DeliveryStatus = e.target.value;
            //   setData([...tempTable]);
            // }}
            onChange={(e) => {
              let tempTable = Data;
              let findIndex = tempTable.findIndex(
                (aa) => aa.key === record.key
              );
              tempTable[findIndex].isDirty = true;
              tempTable[findIndex].DeliveryStatus = e.target.value;
              setData([...tempTable]);
            }}
          />
        );
      },
    },
    {
      dataIndex: "DOD",
      title: "DOD",
      width: 90,
      render: (text, record) => {
        return (
          <DatePicker
            value={text}
            placeholder="DOD"
            disabled={record.SoldStatus === "SOLD"}
            // disabled={true}
            // disabled={
            //   SelectedRow.find((ss) => ss === record.key) ? false : true
            // }
            className="bill-input"
            onChange={(e) => {
              let tempTable = Data;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              tempTable[findIndex].isDirty = true;
              tempTable[findIndex].DOD = e;
              setData([...tempTable]);
            }}
          />
        );
      },
    },
    // { dataIndex: "EP" },
    {
      dataIndex: "EstimatedAmount",
      title: "Estimated Amount",
      width: 80,
      align: "right",
      render: (text) => {
        return parseFloat(text).toFixed(2);
      },
    },

    {
      dataIndex: "ActualSalePrice",
      title: "Actual Sale Price",
      fixed: "right",
      width: 90,
      align: "right",
      render: (text, record) => {
        return (
          <InputNumber
            value={text}
            disabled={
              SelectedRow.find((ss) => ss === record.key)
                ? false
                : true || record.SoldStatus === "SOLD"
            }
            min={0}
            placeholder="Sale Price"
            // disabled={true}
            className="bill-input"
            style={{ width: "100%" }}
            onChange={(e) => {
              let tempTable = Data;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              // tempTable[findIndex].isDirty = true;
              tempTable[findIndex].ActualSalePrice = e;

              if (
                !_.includes(
                  [null, undefined, "", NaN],
                  record.ActualSalePrice
                ) &&
                !_.includes([null, undefined, "", NaN], record.Qty)
              ) {
                tempTable[findIndex].ActualAmount = (
                  parseFloat(record.ActualSalePrice) * parseFloat(record.Qty)
                ).toFixed(2);
                tempTable[findIndex].DiffAmount =
                  tempTable[findIndex].ActualAmount -
                  parseFloat(record.EstimatedAmount);
              } else {
                tempTable[findIndex].ActualAmount = 0;
              }

              setData([...tempTable]);
            }}
          />
        );
      },
    },
    {
      dataIndex: "ActualAmount",
      title: "Actual Amount",
      fixed: "right",
      width: 80,
      align: "right",
      render: (text, record) => {
        return !_.includes(
          [null, undefined, "", NaN],
          record.ActualSalePrice
        ) && !_.includes([null, undefined, "", NaN], record.Qty)
          ? (
              parseFloat(record.ActualSalePrice) * parseFloat(record.Qty)
            ).toFixed(2)
          : 0;
      },
    },

    {
      dataIndex: "DiffAmount",
      title: "Diff",
      fixed: "right",
      width: 70,
      align: "right",
      render: (text, record) => {
        return !_.includes([null, undefined, "", NaN], record.ActualAmount) &&
          !_.includes([null, undefined, "", NaN], record.EstimatedAmount)
          ? (
              parseFloat(record.ActualAmount) -
              parseFloat(record.EstimatedAmount)
            ).toFixed(2)
          : 0;
      },
      ellipsis: true,
    },
    {
      dataIndex: "SoldStatus",
      title: "Sold Status",
      width: 60,
      fixed: "right",
      align: "right",
    },
    {
      title: "",
      width: 65,
      dataIndex: "x",
      fixed: "right",
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="link"
              disabled={record.SoldStatus !== "SOLD"}
              style={{ padding: 0, marginRight: 5 }}
              onClick={() => {
                // props.onDownloadPdf(record);
              }}
            >
              <Tooltip placement="topLeft" title="Download Invoice">
                <DownloadOutlined className="custom-day-book-icon" />
              </Tooltip>
            </Button>
            <Button
              type="link"
              style={{ padding: 0, marginRight: 5 }}
              onClick={() => {
                let data = {
                  VoucherId: record.VoucherId,
                  ItemCode: record.ItemCode,
                  PacketNo: record.PacketNo,
                  IsArchived: "Y",
                  UpdtUsr: l_loginUser.username,
                };
                invUpdateStockOutDtlMKArchive(data).then(() => {
                  props.loadData();
                });
                // props.onViewClick({ visible: true, TranId: record.TranId });
              }}
              // disabled={!hasRightToBeUsedNext(currTran, "VIEW")}
            >
              <Tooltip placement="topLeft" title="Mark Archived">
                <EyeInvisibleOutlined className="custom-day-book-icon" />
              </Tooltip>
            </Button>{" "}
            <Button
              type="link"
              // disabled={record.SoldStatus !== "SOLD"}
              style={{ padding: 0 }}
              onClick={() => {
                props.onEditClick(record);
                // props.onDownloadPdf(record);
              }}
            >
              {/* <Tooltip placement="topLeft" title="Download Invoice"> */}
              <EditOutlined className="custom-day-book-icon" />
              {/* </Tooltip> */}
            </Button>
            <span style={{ marginRight: 5 }}></span>
          </div>
        );
      },
    },
    // { dataIndex: "InvoiceId",title:'Invoice ID' },
    // { dataIndex: "IsArchived" },
    // { dataIndex: "TotalWeight" },
    // { dataIndex: "VoucherId" },
  ];
  return (
    <div style={{ width: "100%" }}>
      <Table
        columns={columnsDtl}
        dataSource={
          Data
            ? Data.filter((aa) =>
                props.showFilter === true ? true : aa.IsArchived === null
              )
            : []
        }
        rowKey="key"
        size="small"
        bordered={true}
        // scroll={{ x: "max-content" }}
        // pagination={true}
        loading={IsLoading || !Data}
      />
      <div
        style={{
          // textAlign: "end",
          padding: "5px",
          border: "1px solid var(--app-theme-color)",
          borderRadius: "3px",
        }}
      >
        <Button
          icon={<PlusCircleOutlined />}
          type="primary"
          style={{ marginRight: 5 }}
          disabled={
            Data && Data.filter((aa) => aa.isDirty === true).length > 0
              ? false
              : true
          }
          // disabled={IsLoading}
          onClick={() => {
            let tempData = Data.filter((aa) => aa.isDirty === true);
            setIsLoading(true);
            let data = {
              StockOutDtlMK: [],
            };

            Data.forEach((row) => {
              data.StockOutDtlMK.push({
                VoucherId: row.VoucherId,
                ItemCode: row.ItemCode,
                PacketNo: row.PacketNo,
                EstimatedPrice: !_.includes([null, "", undefined], row.EP)
                  ? row.EP
                  : null,
                DeliveryStatus: !_.includes(
                  [null, "", undefined],
                  row.DeliveryStatus
                )
                  ? row.DeliveryStatus
                  : null,
                DOD: !_.includes([null, "", undefined], row.DOD)
                  ? moment(row.DOD).format("YYYY-MM-DD")
                  : null,
                ActualSalePrice: !_.includes(
                  [null, "", undefined],
                  row.ActualSalePrice
                )
                  ? row.ActualSalePrice
                  : null,
                UpdtUsr: l_loginUser.username,
              });
            });
            invUpdateStockOutDtlMK(data)
              .then(async (res) => {
                // console.log(res);
                if (res.message === "successful") {
                  notification.success({ message: "Data Saved SuccessFull" });
                } else {
                  notification.error({ message: "Some Error has Occured" });
                }
                let resetData = Data;
                resetData.forEach((row) => {
                  let indx = resetData.findIndex((aa) => aa.key === row.key);
                  resetData[indx].isDirty = false;
                });
                // console.log(resetData, "resetData");
                await setData([...resetData]);
              })
              .catch((err) => {
                notification.error({ message: "Some Error has Occured" });
              })
              .finally(() => {
                setIsLoading(false);
              });
            // console.log(Data, "final");
          }}
        >
          Save
        </Button>
        <Button
          icon={<FileTextOutlined />}
          type="primary"
          style={{ marginRight: 5 }}
          disabled={SelectedRow.length <= 0}
          onClick={() => {
            let tempData = Data.filter((aa) => _.includes(SelectedRow, aa.key));
            if (
              tempData.filter(
                (aa) =>
                  _.includes([null, undefined, ""], aa.Party) ||
                  _.includes([null, undefined, ""], aa.ActualSalePrice)
              ).length > 0
            ) {
              notification.error({
                message: "Required Field Empty",
                description: "Party Name and Actual Sale Price Cannot be empty",
              });
            } else {
              InvGenerateInvoiceMKStockOut(tempData).then((rr) => {
                setSelectedRow([]);
                props.loadData();
              });
            }
          }}
        >
          Generate Invoice
        </Button>
      </div>
    </div>
  );
};

export default StockOutDtlTable;
