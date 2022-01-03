import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Typography } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Tooltip, Drawer } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import fileDownload from "js-file-download";
import {
  DeleteCashBankTransferOrAdjustments,
  fetchDataBankWalletGatewayBookDetail,
} from "../../../services/payModeMaster";
import ViewableDayBookComp from "../../portal/RecieptAndPayments/Components/ViewableDayBookComp";
import styled from "styled-components";
import {
  deleteReceiptAndPayments,
  getReceiptAndPaymentPdf,
  getTransferPdf,
} from "../../../services/receipts-payments";
import {
  hasRightToBeUsedNext,
  PrintPdfOrFromElectron,
} from "../../../shared/utility";
import swal from "sweetalert";
import { fetchDataCashBookDetails } from "../../../services/day-book";
import Modal from "antd/lib/modal/Modal";
import ReceiptAndPaymentCard from "../../portal/RecieptAndPayments/ReceiptAndPaymentCard";
const { Text, Title } = Typography;

const BankAndCashBookTableDetail = (props) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    EntryMode: "",
    TranType: "",
    TranId: 0,
  });
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_ConfigDateTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTTMFORMAT")
  );
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  const userAccessIncome = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 100)[0]
  );
  const userAccessExpense = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 99)[0]
  );
  const userAccessReciept = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 98)[0]
  );
  const userAccessPayment = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 97)[0]
  );
  const userAccessBankAccount = useSelector(
    (state) => state.AppMain.userAccess.filter((i) => i.ModuleId === 119)[0]
  );

  const [DrawerShow, setDrawerShow] = useState({
    TranType: props.TranType,
    VoucherId: null,
    visible: false,
  });
  const [PrintStatus, setPrintStatus] = useState(false);
  const [isRefreshRequired, setIsRefreshRequired] = useState(false);

  useEffect(() => {
    if (props.FromDate !== null && props.ToDate !== null) {
      setIsLoading(true);
      fetchDataBankWalletGatewayBookDetail(
        CompCode,
        props.PayCode,
        props.FromDate,
        props.ToDate
      ).then((res) => {
        setData(res);
        setIsLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (props.FromDate !== null && props.ToDate !== null) {
      setIsLoading(true);
      fetchDataBankWalletGatewayBookDetail(
        CompCode,
        props.PayCode,
        props.FromDate,
        props.ToDate
      ).then((res) => {
        setData(res);
        setIsLoading(false);
      });
    }
  }, [props.PayCode, props.FromDate, props.ToDate, isRefreshRequired]);

  const menu = (record) => {
    return (
      <>
        <Menu>
          {record.TranType !== "TRNFR" && record.TranType !== "ADJS" && (
            <Menu.Item
              disabled={
                record.TranType === "RCT" || record.AllowModify !== "Y"
                  ? !hasRightToBeUsedNext(userAccessReciept.Rights, "EDIT")
                  : record.TranType === "INC" || record.AllowModify !== "Y"
                  ? !hasRightToBeUsedNext(userAccessIncome.Rights, "EDIT")
                  : record.TranType === "PMT" || record.AllowModify !== "Y"
                  ? !hasRightToBeUsedNext(userAccessPayment.Rights, "EDIT")
                  : record.TranType === "EXPS" || record.AllowModify !== "Y"
                  ? !hasRightToBeUsedNext(userAccessExpense.Rights, "EDIT")
                  : ""
              }
              onClick={() => {
                setModal({
                  EntryMode: "E",
                  TranType: record.TranType,
                  TranId: record.TranId,
                });
              }}
            >
              <EditOutlined
                className={`custom-day-book-icon ${
                  record.TranType === "RCT"
                    ? !hasRightToBeUsedNext(userAccessReciept.Rights, "EDIT") ||
                      record.AllowModify !== "Y"
                      ? `disabled`
                      : `edit-btn`
                    : record.TranType === "INC"
                    ? !hasRightToBeUsedNext(userAccessIncome.Rights, "EDIT") ||
                      record.AllowModify !== "Y"
                      ? `disabled`
                      : `edit-btn`
                    : record.TranType === "PMT"
                    ? !hasRightToBeUsedNext(userAccessPayment.Rights, "EDIT") ||
                      record.AllowModify !== "Y"
                      ? `disabled`
                      : `edit-btn`
                    : record.TranType === "EXPS"
                    ? !hasRightToBeUsedNext(userAccessExpense.Rights, "EDIT") ||
                      record.AllowModify !== "Y"
                      ? `disabled`
                      : `edit-btn`
                    : ""
                } `}
              />{" "}
              Edit
            </Menu.Item>
          )}

          {record.TranType === "TRNFR" || record.TranType === "ADJS" ? (
            <Menu.Item
              disabled={
                // record.TranType === "RCT"
                //   ? !hasRightToBeUsedNext(userAccessReciept.Rights, "DELETE")
                //   : record.TranType === "INC"
                //   ? !hasRightToBeUsedNext(userAccessIncome.Rights, "DELETE")
                //   : record.TranType === "PMT"
                //   ? !hasRightToBeUsedNext(userAccessPayment.Rights, "DELETE")
                //   : record.TranType === "EXPS"
                //   ? !hasRightToBeUsedNext(userAccessExpense.Rights, "DELETE")
                //   :
                record.TranType === "TRNFR" || record.TranType === "ADJS"
                  ? !hasRightToBeUsedNext(
                      userAccessBankAccount.Rights,
                      "DELETE"
                    )
                  : ""
              }
              onClick={() => {
                swal("Are you sure you want to delete this record ?", {
                  buttons: ["Cancel", "Yes!"],
                }).then(async (val) => {
                  if (val) {
                    DeleteCashBankTransferOrAdjustments(
                      CompCode,
                      record.TranId
                    ).then((res) => {
                      setIsRefreshRequired(!isRefreshRequired);
                      props.refreshClick();
                    });
                  }
                });
              }}
            >
              <DeleteOutlined
                className={`custom-day-book-icon ${
                  record.TranType === "TRNFR" || record.TranType === "ADJS"
                    ? !hasRightToBeUsedNext(
                        userAccessBankAccount.Rights,
                        "DELETE"
                      )
                      ? `disabled`
                      : `edit-btn`
                    : ""
                } `}
              />
              Delete
            </Menu.Item>
          ) : (
            ""
          )}
        </Menu>
      </>
    );
  };

  const columns = [
    {
      align: "center",
      title: "Tran No.",
      dataIndex: "TranNo",
      width: 120,
      render: (text, record) => {
        return (
          <Text
            style={{
              color: props.legends.find((aa) => aa.key === record.TranType)
                ? props.legends.find((aa) => aa.key === record.TranType).color
                : "auto",
            }}
          >
            {record.TranType === "OPNBAL" ? "" : record.TranNo}
          </Text>
        );
      },
    },
    {
      align: "left",
      title: "Tran Date",
      dataIndex: "TranDate",
      width: 100,
      render: (text, record) => {
        return (
          <Text
            style={{
              color: props.legends.find((aa) => aa.key === record.TranType)
                ? props.legends.find((aa) => aa.key === record.TranType).color
                : "auto",
            }}
          >
            {record.DType === "OPN"
              ? ""
              : moment(record.TranDate).format(l_ConfigDateFormat.value1)}
          </Text>
        );
      },
    },
    {
      align: "left",
      title: "Particulars",
      dataIndex: "RefDesc",
      // width: 0,
      render: (text, record) => {
        return (
          <Text
            style={{
              color: props.legends.find((aa) => aa.key === record.TranType)
                ? props.legends.find((aa) => aa.key === record.TranType).color
                : "auto",
            }}
            ellipsis
          >
            {record.RefDesc} {record.Remark ? `(${record.Remark})` : ""}
          </Text>
        );
      },
    },
    {
      align: "left",
      title: `Original Source`,
      dataIndex: "OriginPaymentSource",
      width: 90,
      render: (text, record) => {
        return (
          <Text
            style={{
              color: props.legends.find((aa) => aa.key === record.TranType)
                ? props.legends.find((aa) => aa.key === record.TranType).color
                : "auto",
            }}
          >
            {record.OriginPaymentSource}
          </Text>
        );
      },
    },
    {
      align: "right",
      title: `Credit (${l_ConfigCurrency.value1})`,
      dataIndex: "Credit",
      width: 100,
      render: (text, record) => {
        return (
          <Text type="success" strong>
            {parseFloat(record.Credit) !== 0 ? record.Credit : "-"}
          </Text>
        );
      },
    },
    {
      align: "right",
      title: `Debit (${l_ConfigCurrency.value1})`,
      dataIndex: "Debit",
      width: 80,
      render: (text, record) => {
        return (
          <Text type="danger" strong>
            {parseFloat(record.Debit) !== 0 ? record.Debit : "-"}
          </Text>
        );
      },
    },
    {
      align: "center",
      dataIndex: "",
      key: "x",
      width: 100,
      render: (text, record) => {
        return (
          <>
            {record.TranType !== "OPNBAL" && record.TranType !== "OPN" && (
              <>
                <Tooltip title="View">
                  <Button
                    icon={<EyeOutlined className="custom-day-book-icon" />}
                    style={{
                      marginRight: 3,
                      height: 22,
                      width: 22,
                      borderRadius: "50%",
                      fontSize: 12,
                    }}
                    type="secondary"
                    size="small"
                    onClick={() => {
                      setDrawerShow({
                        TranType: record.TranType,
                        VoucherId: record.TranId,
                        visible: true,
                      });
                    }}
                  />
                </Tooltip>
                <Tooltip title="PRINT">
                  <Button
                    icon={<DownloadOutlined className="custom-day-book-icon" />}
                    style={{
                      marginRight: 3,
                      height: 22,
                      width: 22,
                      borderRadius: "50%",
                      fontSize: 12,
                    }}
                    type="secondary"
                    size="small"
                    onClick={() => {
                      let dataType = "pdf";
                      if (window.electron) {
                        dataType = "html";
                      }

                      if (record.TranType === "TRNFR") {
                        getTransferPdf(
                          record.TranType,
                          record.TranId,
                          dataType
                        ).then((res) => {
                          if (res) {
                            PrintPdfOrFromElectron(
                              res,
                              `${record.TranType}-${record.TranId}`,
                              dataType
                            );
                          }
                        });
                      } else {
                        getReceiptAndPaymentPdf(
                          CompCode,
                          record.TranType,
                          record.TranId,
                          dataType
                        ).then((res) => {
                          if (res) {
                            PrintPdfOrFromElectron(
                              res,
                              `${record.TranType}-${record.TranId}`,
                              dataType
                            );
                          }
                        });
                      }
                    }}
                  />
                </Tooltip>{" "}
                <Dropdown overlay={menu(record)} placement="bottomLeft" arrow>
                  <Button
                    className="custom-day-book-setting"
                    icon={
                      <SettingOutlined className="custom-day-book-icon custom-day-book-setting" />
                    }
                    style={{
                      marginRight: 3,
                      height: 22,
                      width: 22,
                      borderRadius: "50%",
                      fontSize: 12,
                    }}
                    type="secondary"
                    size="small"
                    onClick={() => {}}
                  />
                </Dropdown>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <Card>
      <Container>
        <Table
          style={{ width: "100%" }}
          loading={isLoading}
          columns={columns}
          bordered={true}
          dataSource={data}
          className="receipt-payment-table"
          pagination={false}
          summary={(pageData) => {
            let totalCreditAmount = 0;
            let totalDebitAmount = 0;
            let closingBalDebit = 0;
            let closingBalCredit = 0;

            if (pageData.length > 0) {
              pageData.forEach(({ Credit, Debit }) => {
                totalCreditAmount += parseFloat(Credit);
                totalDebitAmount += parseFloat(Debit);
              });
            }

            if (totalCreditAmount - totalDebitAmount > 0) {
              closingBalCredit = totalCreditAmount - totalDebitAmount;
            } else {
              closingBalDebit = totalDebitAmount - totalCreditAmount;
            }

            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>Total ({l_ConfigCurrency.value1})</Text>
                  </Table.Summary.Cell>{" "}
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell className="custom-table-summary-amount">
                    <Text strong>{totalCreditAmount.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className="custom-table-summary-amount">
                    <Text strong>{totalDebitAmount.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>
                      Closing Balance ({l_ConfigCurrency.value1})
                    </Text>
                  </Table.Summary.Cell>{" "}
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell className="custom-table-summary-amount">
                    <Text strong>{closingBalCredit.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell className="custom-table-summary-amount">
                    <Text strong>{closingBalDebit.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
        <Drawer
          placement="right"
          closable={true}
          width={window.innerWidth > 800 ? "50%" : "100%"}
          bodyStyle={{ padding: 0 }}
          destroyOnClose={true}
          onClose={() => {
            setDrawerShow({
              TranType: props.TranType,
              VoucherId: null,
              visible: false,
            });
          }}
          visible={DrawerShow.visible}
        >
          <ViewableDayBookComp
            VoucherId={DrawerShow.VoucherId}
            TranType={DrawerShow.TranType}
            onClose={() => {
              setDrawerShow({
                TranType: props.TranType,
                VoucherId: null,
                visible: false,
              });
            }}
            PrintStatus={PrintStatus}
            onPrintClick={() => {
              setPrintStatus(true);
              let dataType = "pdf";
              if (window.electron) {
                dataType = "html";
              }

              if (DrawerShow.TranType === "TRNFR") {
                getTransferPdf(
                  DrawerShow.TranType,
                  DrawerShow.VoucherId,
                  dataType
                ).then((res) => {
                  if (res) {
                    PrintPdfOrFromElectron(
                      res,
                      `${DrawerShow.TranType}-${DrawerShow.TranId}`,
                      dataType
                    );

                    setPrintStatus(false);
                  }
                });
              } else {
                getReceiptAndPaymentPdf(
                  CompCode,
                  DrawerShow.TranType,
                  DrawerShow.VoucherId,
                  dataType
                ).then((res) => {
                  if (res) {
                    PrintPdfOrFromElectron(
                      res,
                      `${DrawerShow.TranType}-${DrawerShow.TranId}`,
                      dataType
                    );

                    setPrintStatus(false);
                  }
                });
              }
            }}
          />
        </Drawer>
      </Container>
      {modal.EntryMode && (
        <Modal
          closable={true}
          visible={modal}
          onCancel={() =>
            setModal({
              EntryMode: "",
              TranType: "",
              TranId: 0,
            })
          }
          footer={null}
          width={"75%"}
          bodyStyle={{ padding: 0 }}
          destroyOnClose={true}
        >
          <div style={{ height: 40 }}> </div>
          <ReceiptAndPaymentCard
            EntryMode={modal.EntryMode}
            TranType={modal.TranType}
            TranId={modal.TranId}
            onBackPress={() => {
              setModal({
                EntryMode: "",
                TranType: "",
                TranId: 0,
              });
            }}
            onSavePress={() => {
              setModal({
                EntryMode: "",
                TranType: "",
                TranId: 0,
              });

              fetchDataBankWalletGatewayBookDetail(
                CompCode,
                props.PayCode,
                props.FromDate,
                props.ToDate
              ).then((res) => {
                setData(res);
                setIsLoading(false);
              });
            }}
          />
        </Modal>
      )}
    </Card>
  );
};

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  height: 100%;
  border-radius: 5px;
  background-color: #f0eee4;
`;

const Container = styled.div`
  padding: 8px 8px;
  display: flex;
`;

export default BankAndCashBookTableDetail;
