import React, { useState, useEffect, useCallback } from "react";
import {
  invDeleteAdjustment,
  InvGetDataMKStockOut,
  invUpdateStockOutDtlMKArchive,
  InvGenerateInvoiceMKStockOut,
  invUpdateStockOutDtlMK,
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
  Menu,
  Dropdown,
} from "antd";
import moment from "moment";
import StockOutDtlTable from "./StockOutDtlTable";
import { getDataCustomers } from "../../../services/user-master";
import { fetchDeliveryStatusOM } from "../../../services/othermaster";
import {
  DeleteTwoTone,
  EyeInvisibleOutlined,
  EyeInvisibleTwoTone,
  DownloadOutlined,
  EditOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
  SettingTwoTone,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import _ from "lodash";
import { hasRightToBeUsedNext } from "../../../shared/utility";
import MenuDropDown from "./Component/MenuDropDown";
import ReportsMain from "../../portal/Reports/ReportsMain";

const { Option } = Select;

const StockOutTable = (props) => {
  const [IsLoading, setIsLoading] = useState(false);
  const [stockOutMaster, setStockOutMaster] = useState();
  const [expandedRow, setExpandedRow] = useState([]);
  const [renderDtlComponent, setRenderDtlComponent] = useState(false);
  const [customerMaster, setCustomerMaster] = useState([]);
  const [showFilter, setShowFilter] = useState(props.showFilter);
  const [showSearchData, setShowSearchData] = useState({
    boxNo: null,
    pcktNo: null,
  });
  const l_loginUser = useSelector((state) => state.LoginReducer.userData);
  const [SelectedRow, setSelectedRow] = useState([]);
  const currTran = useSelector((state) => state.currentTran.moduleRights);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  // useEffect(() => {
  //   initialLoad().then((res) => {
  //     setStockOutMaster(res ? [...res] : []);
  //     // console.log(res, "array");
  //   });
  //   return () => {};
  // }, []);

  useEffect(() => {
    setShowFilter(props.showFilter);
  }, [props.showFilter]);

  useEffect(() => {
    initialLoad().then((res) => {
      // console.log("loading")
      setStockOutMaster(res ? [...res] : []);
      // console.log(
      //   res.filter((aa) => aa.IsArchived !== "Y"),
      //   "array"
      // );
    });
    return () => {};
  }, [showFilter]);

  const [showModal, setShowModal] = useState(false);
  const [selectedAllBox, setSelectedAllBox] = useState([]);

  const onSelectAll = (text, record) => {
    const temp_stockOutMaster = stockOutMaster
      ? showFilter
        ? stockOutMaster
        : stockOutMaster.filter((aa) => aa.IsArchived !== "Y")
      : [];
    if (selectedAllBox.findIndex((dd) => dd == record.BoxNo) >= 0) {
      setSelectedAllBox([
        ...selectedAllBox.filter((aa) => aa !== record.BoxNo),
      ]);
      let allBoxData = temp_stockOutMaster.filter(
        (aa) => aa.BoxNo === record.BoxNo
      );
      allBoxData = allBoxData.map((aa) => aa.key);
      let difference = SelectedRow.filter((x) => !allBoxData.includes(x));

      setSelectedRow([...difference]);
      console.log([...difference], "stock1");
    } else {
      setSelectedAllBox([...selectedAllBox, record.BoxNo]);
      let allBoxData = temp_stockOutMaster.filter(
        (aa) => aa.BoxNo === record.BoxNo
      );
      allBoxData = allBoxData.map((aa) => aa.key);
      setSelectedRow([...SelectedRow, ...allBoxData]);
      console.log([...SelectedRow, ...allBoxData], "stock1");
    }
  };

  const [deliveryStatus, setDeliveryStatus] = useState([]);

  const initialLoad = async () => {
    return new Promise((resolve, reject) => {
      try {
        let stkMaster, expandedRowsArr;
        setIsLoading(true);
        setTimeout(async () => {
          await getDataCustomers(CompCode).then((res) => {
            setCustomerMaster(res);
          });
          await InvGetDataMKStockOut(CompCode).then(async (stkOut) => {
            if (stkOut.length > 0) {
              // console.log(stkOut.filter((aa) => aa.IsArchived !== "Y"));

              let tempStkMaster = stkOut.filter((aa) =>
                showFilter ? true : aa.IsArchived !== "Y"
              );
              stkMaster = await tempStkMaster.map((element, index) => {
                return {
                  ...element,
                  key: index + 1,
                  displayedBoxNo:
                    index > 0 &&
                    tempStkMaster[index - 1].BoxNo === element.BoxNo
                      ? null
                      : element.BoxNo,
                  DOD: element.DOD !== null ? moment(element.DOD) : null,
                  Party: element.PName,
                };
                //   let findDataIndex = tempData.findIndex(
                //     (aa) => aa.BoxNo === element.BoxNo
                //   );
                //   if (findDataIndex >= 0) {
                //     tempData[findDataIndex].Weight = (
                //       parseFloat(tempData[findDataIndex].Weight) +
                //       parseFloat(element.Weight)
                //     ).toFixed(2);
                //     tempData[findDataIndex].Qty = (
                //       parseFloat(tempData[findDataIndex].Qty) +
                //       parseFloat(element.Qty)
                //     ).toFixed(2);
                //     tempData[findDataIndex].ALLArchived = _.includes(
                //       ["N", null],
                //       element.IsArchived
                //     )
                //       ? false
                //       : true;
                //     tempData[findDataIndex].dtlData.push({
                //       ...element,
                //       key: tempData[findDataIndex].dtlData.length + 1,
                //       DOD: element.DOD == null ? null : moment(element.DOD),
                //       Party:
                //         element.PName !== null ? parseInt(element.PName) : null,
                //       isDirty: false,
                //     });
                //   } else {
                //     tempData.push({
                //       key: tempData.length + 1,
                //       BoxNo: element.BoxNo,
                //       Weight: parseFloat(element.Weight).toFixed(2),
                //       Qty: parseFloat(element.Qty).toFixed(2),
                //       dtlData: [
                //         {
                //           ...element,
                //           key: 1,
                //           DOD: element.DOD == null ? null : moment(element.DOD),
                //           isDirty: false,
                //           Party:
                //             element.PName !== null
                //               ? parseInt(element.PName)
                //               : null,
                //         },
                //       ],
                //       ALLArchived: _.includes(["N", null], element.IsArchived)
                //         ? false
                //         : true,
                //     });
                //   }
              });

              // expandedRowsArr = tempData.map((aa) => aa.key);
              // stkMaster = tempData;
            }
          });
          fetchDeliveryStatusOM(CompCode).then((res) => {
            setDeliveryStatus(res);
          });
          // await setExpandedRow(
          //   expandedRowsArr && expandedRowsArr.length > 0
          //     ? [...expandedRowsArr]
          //     : []
          // );
          // console.log(stkMaster); check data
          setIsLoading(false);
          resolve(stkMaster);
        }, 100);
      } catch (error) {
        reject(error);
      }
    });
  };
  const MenuList = ({ text, record }) => (
    <Menu key={`${record.BoxNo}-0`}>
      <Menu.Item
        key={`${record.BoxNo}-1`}
        className="m-0 p-0 bg-white active:bg-white"
      >
        <div
          className="px-2 flex justify-between"
          onClick={() => {
            onSelectAll(text, record);
          }}
        >
          <div>Select All</div>
          <div>
            <Checkbox
              checked={
                selectedAllBox.findIndex((dd) => dd == record.BoxNo) >= 0
                  ? true
                  : false
              }
              onChange={() => {
                onSelectAll(text, record);
              }}
            />
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <MenuDropDown
        key={`${record.BoxNo}-2`}
        onMenuClick={() => {
          props.onEditClick(record);
        }}
        title="Edit"
        Icon={<EditOutlined className="custom-day-book-icon" />}
        disabled={!hasRightToBeUsedNext(currTran, "EDIT")}
      />
      <MenuDropDown
        key={`${record.BoxNo}-3`}
        onMenuClick={() => {
          let tempData = stockOutMaster.filter(
            (aa) => aa.VoucherId === record.VoucherId
          );
          setIsLoading(true);
          Promise.all(
            tempData.map((td) => {
              let data = {
                VoucherId: td.VoucherId,
                ItemCode: td.ItemCode,
                PacketNo: td.PacketNo,
                IsArchived: "Y",
                UpdtUsr: l_loginUser.username,
              };
              invUpdateStockOutDtlMKArchive(CompCode, data).then((res) => {
                return res;
              });
            })
          ).finally(() => {
            setIsLoading(false);
            props.refreshScreen(showFilter);
          });
        }}
        title={` Archive ${record.BoxNo}`}
        Icon={<EyeInvisibleOutlined className="custom-day-book-icon" />}
      />

      <MenuDropDown
        key={`${record.BoxNo}-4`}
        onMenuClick={() => {
          setIsLoading(true);
          invDeleteAdjustment(CompCode, record.VoucherId, l_loginUser.username)
            .then((res) => {
              return res;
            })
            .finally(() => {
              setIsLoading(false);
              props.refreshScreen(showFilter);
            });
        }}
        title={`Delete ${record.BoxNo}`}
        Icon={<DeleteTwoTone className="text-primary-color" />}
        disabled={!hasRightToBeUsedNext(currTran, "DELETE")}
      />
    </Menu>
  );
  let columns = [
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
    {
      dataIndex: "displayedBoxNo",
      title: "Box No",
      width: 140,
      fixed: "left",
      render: (text, record) => {
        return (
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, margin: "auto" }}> {text}</div>
            {text !== null && (
              <>
                <Dropdown
                  key={record.BoxNo}
                  className="cursor-pointer"
                  overlay={<MenuList text={text} record={record} />}
                  placement="bottomLeft"
                  arrow
                >
                  <div className="rounded-full border border-solid border-gray-100 flex justify-center items-center h-6 w-6 self-center">
                    <SettingTwoTone />
                  </div>
                </Dropdown>
                {/* <Button
                  type="link"
                  // disabled={record.SoldStatus !== "SOLD"}
                  style={{ padding: 0, marginLeft: 5 }}
                  onClick={() => {
                    props.onEditClick(record);
                    // props.onDownloadPdf(record);
                  }}
                  disabled={!hasRightToBeUsedNext(currTran, "EDIT")}
                >
                  <Tooltip placement="topLeft" title="Download Invoice">
                  <EditOutlined className="custom-day-book-icon" />
                  </Tooltip>
                </Button>
                <Button
                  type="link"
                  style={{ padding: 0, marginLeft: 5 }}
                  onClick={() => {
                    let tempData = stockOutMaster.filter(
                      (aa) => aa.VoucherId === record.VoucherId
                    );
                    setIsLoading(true);
                    Promise.all(
                      tempData.map((td) => {
                        let data = {
                          VoucherId: td.VoucherId,
                          ItemCode: td.ItemCode,
                          PacketNo: td.PacketNo,
                          IsArchived: "Y",
                          UpdtUsr: l_loginUser.username,
                        };
                        console.log(data, "archvie");

                        invUpdateStockOutDtlMKArchive(CompCode, data).then(
                          (res) => {
                            return res;
                          }
                        );
                      })
                    ).finally(() => {
                      setIsLoading(false);
                      props.refreshScreen(showFilter);
                    });
                  }}
                >
                  <Tooltip
                    placement="topLeft"
                    title={`Mark Archived All For ${record.BoxNo}`}
                  >
                    <EyeInvisibleOutlined className="custom-day-book-icon" />
                  </Tooltip>
                </Button>
                <Button
                  type="link"
                  style={{ padding: 0, marginLeft: 5 }}
                  onClick={() => {
                    setIsLoading(true);
                    invDeleteAdjustment(
                      CompCode,
                      record.VoucherId,
                      l_loginUser.username
                    )
                      .then((res) => {
                        return res;
                      })
                      .finally(() => {
                        setIsLoading(false);
                        props.refreshScreen(showFilter);
                      });
                  }}
                  disabled={!hasRightToBeUsedNext(currTran, "DELETE")}
                >
                  <Tooltip
                    placement="topLeft"
                    title={`Delete All For ${record.BoxNo}`}
                  >
                    <DeleteTwoTone className="custom-day-book-icon" />
                  </Tooltip>
                </Button> */}
              </>
            )}
          </div>
        );
      },
    },
    // { dataIndex: "Weight", title: "Weight", width: 150 },
    // { dataIndex: "Qty", title: "Total Qty", width: 80, fixed: "left" },
    { dataIndex: "ItemName", title: "Item Name", width: 160, fixed: "left" },
    { dataIndex: "Qty", title: "Qty", width: 60 },
    { dataIndex: "PacketNo", title: "Packet No", width: 80 },
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
              let tempTable = stockOutMaster;
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
              setStockOutMaster([...tempTable]);
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
              value={
                record.Party && record.Party !== null
                  ? parseInt(record.Party)
                  : null
              }
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
                let tempTable = stockOutMaster;
                let findIndex = tempTable.findIndex(
                  (aa) => aa.key == record.key
                );
                if (e) {
                  tempTable[findIndex].isDirty = true;
                  tempTable[findIndex].isPartyDirty = true;
                  tempTable[findIndex].Party = e;
                  tempTable[findIndex].PName = option ? option.data.Name : null;
                } else {
                  tempTable[findIndex].isPartyDirty = false;
                  tempTable[findIndex].Party = null;
                  tempTable[findIndex].PName = null;
                }
                const BoxItem = tempTable
                  .filter(
                    (xx) =>
                      xx.BoxNo === tempTable[findIndex].BoxNo &&
                      (_.includes(
                        [undefined, "undefined", false],
                        xx.isPartyDirty
                      ) ||
                        _.includes([undefined, "undefined", null], xx.Party))
                  )
                  .map((aa) => aa.key);
                const selectedBoxItem = BoxItem.filter((aa) =>
                  _.includes(SelectedRow, aa)
                );
                selectedBoxItem.forEach((row, ind) => {
                  let findIndexTemp = tempTable.findIndex(
                    (aa) => aa.key == row
                  );
                  tempTable[findIndexTemp].isDirty = true;
                  tempTable[findIndexTemp].isPartyDirty = true;
                  tempTable[findIndexTemp].Party = e;
                  tempTable[findIndexTemp].PName = option
                    ? option.data.Name
                    : null;
                });

                setStockOutMaster([...tempTable]);
              }}
            >
              {customerMaster.map((row) => {
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
          <>
            <Select
              style={{ minWidth: 125 }}
              placeholder="Delivery Status"
              disabled={record.SoldStatus === "SOLD"}
              className="bill-input min-w-max"
              value={text}
              allowClear
              onChange={(e) => {
                let tempTable = stockOutMaster;
                let findIndex = tempTable.findIndex(
                  (aa) => aa.key == record.key
                );
                if (e) {
                  tempTable[findIndex].isDirty = true;
                  tempTable[findIndex].isDeliveryStatusDirty = true;
                  tempTable[findIndex].DeliveryStatus = e;
                } else {
                  tempTable[findIndex].isDeliveryStatusDirty = false;
                  tempTable[findIndex].DeliveryStatus = null;
                }
                const BoxItem = tempTable
                  .filter(
                    (xx) =>
                      (xx.BoxNo === tempTable[findIndex].BoxNo &&
                        _.includes(
                          [undefined, "undefined", false],
                          xx.isDeliveryStatusDirty
                        )) ||
                      _.includes(
                        [undefined, "undefined", null],
                        xx.DeliveryStatus
                      )
                  )
                  .map((aa) => aa.key);
                const selectedBoxItem = BoxItem.filter((aa) =>
                  _.includes(SelectedRow, aa)
                );
                selectedBoxItem.forEach((row, ind) => {
                  let findIndexTemp = tempTable.findIndex(
                    (aa) => aa.key == row
                  );
                  tempTable[findIndexTemp].isDirty = true;
                  tempTable[findIndexTemp].isDeliveryStatusDirty = true;
                  tempTable[findIndexTemp].DeliveryStatus = e;
                });
                setStockOutMaster([...tempTable]);
              }}
            >
              {deliveryStatus.map((ds) => {
                return (
                  <Option key={ds.ShortCode} value={ds.ShortCode}>
                    {ds.MasterDesc}
                  </Option>
                );
              })}
            </Select>
            {/* <Input
             value={text}
          //   placeholder="Delivery Status"
          //   // disabled={
          //   //   SelectedRow.find((ss) => ss === record.key) ? false : true
          //   // }
          //   disabled={record.SoldStatus === "SOLD"}
          //   className="bill-input"
          //   onChange={(e) => {
          //     let tempTable = stockOutMaster;
          //     let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
          //     tempTable[findIndex].isDirty = true;
          //     tempTable[findIndex].DeliveryStatus = e.target.value;
          //     setStockOutMaster([...tempTable]);
          //   }}
          // /> */}
          </>
        );
      },
    },
    {
      dataIndex: "DOD",
      title: "DOD",
      width: 130,
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
              let tempTable = stockOutMaster;
              let findIndex = tempTable.findIndex((aa) => aa.key == record.key);
              // tempTable[findIndex].isDirty = true;
              // tempTable[findIndex].DOD = e;

              if (e) {
                tempTable[findIndex].isDirty = true;
                tempTable[findIndex].isDODDirty = true;
                tempTable[findIndex].DOD = e;
              } else {
                tempTable[findIndex].isDODDirty = false;
                tempTable[findIndex].DOD = null;
              }
              const BoxItem = tempTable
                .filter(
                  (xx) =>
                    (xx.BoxNo === tempTable[findIndex].BoxNo &&
                      _.includes(
                        [undefined, "undefined", false],
                        xx.isDODDirty
                      )) ||
                    _.includes([undefined, "undefined", null], xx.DOD)
                )
                .map((aa) => aa.key);
              const selectedBoxItem = BoxItem.filter((aa) =>
                _.includes(SelectedRow, aa)
              );
              selectedBoxItem.forEach((row, ind) => {
                let findIndexTemp = tempTable.findIndex((aa) => aa.key == row);
                tempTable[findIndexTemp].isDirty = true;
                tempTable[findIndexTemp].isDODDirty = true;
                tempTable[findIndexTemp].DOD = e;
              });
              setStockOutMaster([...tempTable]);
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
      width: 95,
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
              let tempTable = stockOutMaster;
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

              setStockOutMaster([...tempTable]);
            }}
          />
        );
      },
    },
    {
      dataIndex: "ActualAmount",
      title: "Actual Amount",
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
      align: "center",
    },
    {
      title: "Action",
      width: 65,
      dataIndex: "x",
      fixed: "right",
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* <Button
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
            </Button> */}
            {(record.IsArchived === "N" || record.IsArchived === null) && (
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
                  invUpdateStockOutDtlMKArchive(CompCode, data).then(() => {
                    // props.loadData();
                  });
                  props.refreshScreen(showFilter);
                }}
                disabled={!hasRightToBeUsedNext(currTran, "VIEW")}
              >
                <Tooltip placement="topLeft" title="Mark Archived">
                  <EyeInvisibleOutlined className="custom-day-book-icon" />
                </Tooltip>
              </Button>
            )}
            <span style={{ marginRight: 5 }}></span>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          backgroundColor: "#FFF",
          borderRadius: 3,
          padding: "5px",
          border: "1px solid var(--app-theme-color)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            style={{ marginRight: 7 }}
            onClick={() => {
              props.onAddStockClick({ type: "ADDSTOCK", record: null });
            }}
            disabled={!hasRightToBeUsedNext(currTran, "ADD")}
          >
            Add Stock Out
          </Button>
          Show Archived
          <Checkbox
            style={{ margin: "0px 5px" }}
            checked={showFilter}
            onChange={(e) => {
              setShowFilter(e.target.checked);
            }}
          ></Checkbox>
          Box No
          <Input
            style={{ width: 150, margin: "0px 5px" }}
            allowClear
            placeholder="Box No."
            onChange={(e) => {
              setShowSearchData({ ...showSearchData, boxNo: e.target.value });
            }}
          />
          Packet No
          <Input
            style={{ width: 150, margin: "0px 5px" }}
            allowClear
            placeholder="Packet No."
            onChange={(e) => {
              setShowSearchData({ ...showSearchData, pcktNo: e.target.value });
            }}
          />
        </div>
        <div>
          <Button
            icon={<SnippetsOutlined />}
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => {
              setShowModal(true);
              // setEntryMode("A");
            }}
            // disabled={!hasRightToBeUsedNext(currTran, "ADD")}
          >
            Show Reports
          </Button>
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            style={{ marginRight: 5 }}
            disabled={
              stockOutMaster &&
              stockOutMaster.filter((aa) => aa.isDirty === true).length > 0
                ? false
                : true
            }
            // disabled={IsLoading}
            onClick={() => {
              let tempData = stockOutMaster.filter((aa) => aa.isDirty === true);
              setIsLoading(true);
              let data = {
                StockOutDtlMK: [],
              };

              stockOutMaster.forEach((row) => {
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
              invUpdateStockOutDtlMK(CompCode, data)
                .then(async (res) => {
                  // console.log(res);
                  if (res.message === "successful") {
                    notification.success({ message: "Data Saved SuccessFull" });
                  } else {
                    notification.error({ message: "Some Error has Occured" });
                  }
                  let resetData = stockOutMaster;
                  resetData.forEach((row) => {
                    let indx = resetData.findIndex((aa) => aa.key === row.key);
                    resetData[indx].isDirty = false;
                  });
                  // console.log(resetData, "resetData");
                  await setStockOutMaster([...resetData]);
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
              try {
                setIsLoading(true);
                // invoice generate
                let tempData = stockOutMaster.filter((aa) =>
                  _.includes(SelectedRow, aa.key)
                );
                if (
                  tempData.filter(
                    (aa) =>
                      _.includes([null, undefined, ""], aa.Party) ||
                      _.includes([null, undefined, ""], aa.ActualSalePrice)
                  ).length > 0
                ) {
                  notification.error({
                    message: "Required Field Empty",
                    description:
                      "Party Name and Actual Sale Price Cannot be empty",
                  });
                } else {
                  InvGenerateInvoiceMKStockOut(CompCode, tempData).then(
                    (rr) => {
                      setSelectedRow([]);
                      props.refreshScreen(showFilter);
                      // props.loadData();
                    }
                  );
                }
                //archive data
                let tempDataArchive = stockOutMaster.filter((aa) =>
                  _.includes(SelectedRow, aa.key)
                );
                Promise.all(
                  tempDataArchive.map((td) => {
                    let data = {
                      VoucherId: td.VoucherId,
                      ItemCode: td.ItemCode,
                      PacketNo: td.PacketNo,
                      IsArchived: "Y",
                      UpdtUsr: l_loginUser.username,
                    };

                    invUpdateStockOutDtlMKArchive(CompCode, data).then(
                      (res) => {
                        return res;
                      }
                    );
                  })
                ).finally(() => {
                  setIsLoading(false);
                  props.refreshScreen(showFilter);
                });
              } catch (error) {
                notification.error({
                  message: "Error Occured",
                  description: error,
                });
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Generate Invoice
          </Button>
        </div>
      </div>
      <div style={{ border: "1px solid #d9d9d9" }}>
        {/* {console.log(
          showSearchData,
          (showSearchData.boxNo || showSearchData.pcktNo) &&
            stockOutMaster.filter(
              (item) =>
                (item[`BoxNo`] &&
                  item[`BoxNo`]
                    .toString()
                    .toLowerCase()
                    .includes(
                      showSearchData.boxNo && showSearchData.boxNo.toLowerCase()
                    )) ||
                (item[`PacketNo`] &&
                  item[`PacketNo`]
                    .toString()
                    .toLowerCase()
                    .includes(
                      showSearchData.pcktNo &&
                        showSearchData.pcktNo.toLowerCase()
                    ))
            )
        )} */}
        <Table
          columns={columns}
          scroll={{ x: "max-content" }}
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <StockOutDtlTable
          //       showFilter={showFilter}
          //       customerMaster={customerMaster}
          //       record={record}
          //       loadData={() => {
          //         initialLoad().then(() => {
          //           setRenderDtlComponent(true);
          //         });
          //       }}
          //       renderDtlComponent={renderDtlComponent}
          //       renderDtlComponentRevert={() => {
          //         setRenderDtlComponent(false);
          //       }}
          //       // dataLoading={IsLoading}
          //       onEditClick={(record) => props.onEditClick(record)}
          //     />
          //   ),
          //   // defaultExpandedRowKeys: expandedRow,
          //   // defaultExpandAllRows: true,
          //   // expandedRowKeys: expandedRow,
          //   expandedRowKeys: expandedRow,
          //   // rowExpandable: (record) => record.name !== "Not Expandable",
          //   onExpand: (expanded, record) => {
          //     let findData = expandedRow.find((aa) => aa === record.key);
          //     if (!findData) {
          //       setExpandedRow([...expandedRow, record.key]);
          //     } else {
          //       setExpandedRow([
          //         ...expandedRow.filter((aa) => aa !== record.key),
          //       ]);
          //     }
          //   },
          // }}
          rowKey="key"
          // size='middle'
          className="custom-pagination"
          pagination={{
            defaultPageSize: 20,
            size: "small",
          }}
          bordered={true}
          dataSource={
            !_.includes([null, undefined, ""], showSearchData.boxNo) ||
            !_.includes([null, undefined, ""], showSearchData.pcktNo)
              ? stockOutMaster.filter(
                  (item) =>
                    item.isDirty === true ||
                    (item[`BoxNo`] &&
                      item[`BoxNo`]
                        .toString()
                        .toLowerCase()
                        .includes(
                          showSearchData.boxNo &&
                            showSearchData.boxNo.toLowerCase()
                        )) ||
                    (item[`PacketNo`] &&
                      item[`PacketNo`]
                        .toString()
                        .toLowerCase()
                        .includes(
                          showSearchData.pcktNo &&
                            showSearchData.pcktNo.toLowerCase()
                        ))
                )
              : stockOutMaster
              ? stockOutMaster
              : []
          }
          // dataSource={stockOutMaster ? stockOutMaster : []}
          loading={IsLoading || !stockOutMaster}
        />
      </div>
      <Modal
        // title={"Customer"}
        visible={showModal}
        footer={false}
        bodyStyle={{ padding: "0px 0px" }}
        style={{ top: 20 }}
        destroyOnClose={true}
        onCancel={() => {
          setShowModal(false);
        }}
        width={"95%"}
      >
        <ReportsMain
          isModal={true}
          // reportGroups={["Registers"]}
          // reportIds={[28,29,13]}
          reportId={"43"}
          reportGroups={["Mk stock out Reports"]}
        />
      </Modal>
    </>
  );
};

export default StockOutTable;
