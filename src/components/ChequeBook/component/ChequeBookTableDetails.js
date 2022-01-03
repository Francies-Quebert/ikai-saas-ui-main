import React, { useState, useEffect } from "react";
import { Typography, Modal, Drawer } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Tooltip } from "antd";
import {
  ExclamationCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  fetchDataChequeSettlement,
  updtCheque_Deposit_Witdraw_ReOpen,
} from "../../../services/payModeMaster";
import styled from "styled-components";
import TransferAndAjustments from "../../BankAndCashBook/components/TransferAndAjustments";
import ViewableDayBookComp from "../../portal/RecieptAndPayments/Components/ViewableDayBookComp";
import fileDownload from "js-file-download";
import {
  getReceiptAndPaymentPdf,
  getTransferPdf,
} from "../../../services/receipts-payments";
import { PrintPdfOrFromElectron } from "../../../shared/utility";
const { Text, Title } = Typography;

const BankAndCashBookTableDetail = (props) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState();
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );
  const l_ConfigDateTimeFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTTMFORMAT")
  );
  const l_ConfigCurrency = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "CURRENCY")
  );
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const [DrawerShow, setDrawerShow] = useState({
    TranType: props.TranType,
    VoucherId: null,
    visible: false,
  });
  const [PrintStatus, setPrintStatus] = useState(false);

  const { confirm } = Modal;

  const columns = [
    {
      align: "center",
      title: "Tran No.",
      dataIndex: "TranNo",
      width: 120,
      render: (text, record) => {
        // console.log(record);
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
    // {
    //   align: "left",
    //   title: `Source`,
    //   dataIndex: "OriginPaymentSource",
    //   width: 110,
    //   render: (text, record) => {
    //     return (
    //       <Text
    //         style={{
    //           color: props.legends.find((aa) => aa.key === record.TranType)
    //             ? props.legends.find((aa) => aa.key === record.TranType).color
    //             : "auto",
    //         }}
    //       >
    //         {record.OriginPaymentSource}
    //       </Text>
    //     );
    //   },
    // },
    // {
    //   align: "right",
    //   title: `Credit (${l_ConfigCurrency.value1})`,
    //   dataIndex: "Credit",
    //   width: 100,
    //   render: (text, record) => {
    //     return (
    //       <Text type="success" strong>
    //         {parseFloat(record.Credit) !== 0 ? record.Credit : "-"}
    //       </Text>
    //     );
    //   },
    // },
    {
      align: "right",
      title: `Ammount (${l_ConfigCurrency.value1})`,
      dataIndex: "Debit",
      width: 100,
      render: (text, record) => {
        return <Text>{record.Amount}</Text>;
      },
    },
    {
      title: "Action",
      width: 100,
      render: (text, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {record.AllowReOpen !== "Y" ? (
              <>
                {record.DepositOrWithdraw === "W" ? (
                  <Button
                    size="small"
                    type="danger"
                    // style={{ marginRight: 5 }}
                    onClick={() => {
                      setShowModal({
                        type: "WITHDRAW",
                        Amount: Math.abs(parseFloat(record.Amount)),
                        TranType: record.TranType,
                        TranId: record.TranId,
                        DetailId: record.DetailId,
                      });
                    }}
                    disabled={!props.IsWithdrawAllowed}
                  >
                    Withdraw
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setShowModal({
                        type: "DEPOSIT",
                        Amount: Math.abs(parseFloat(record.Amount)),
                        TranType: record.TranType,
                        TranId: record.TranId,
                        DetailId: record.DetailId,
                      });
                    }}
                    size="small"
                    style={{
                      width: 75,
                      backgroundColor: "green",
                      color: "#FFF",
                    }}
                    disabled={!props.IsDepositAllowed}
                  >
                    Deposit
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  confirm({
                    title: "Do you want to re-open these items?",
                    icon: <ExclamationCircleOutlined />,
                    content: "When clicked the OK button, Item will Reopen",
                    onOk() {
                      return new Promise((resolve, reject) => {
                        updtCheque_Deposit_Witdraw_ReOpen(CompCode, {
                          TranType: record.TranType,
                          DetailTranId: record.DetailId,
                          ChequeTranDocId: record.RefDocId,
                          UpdtUsr: l_loginUser,
                          IsReOpen: true,
                        })
                          .then((res) => {
                            props.refrehPage();
                            resolve(res);
                          })
                          .catch((er) => reject(er));
                      }).catch(() => console.log("Oops errors!"));
                    },
                    onCancel() {},
                  });
                }}
                disabled={!props.IsReOpenAllowed}
              >
                Re-Open
              </Button>
            )}
          </div>
        );
      },
    },
    {
      align: "center",
      dataIndex: "",
      key: "x",
      width: 80,
      render: (text, record) => {
        return (
          <>
            {record.TranType !== "OPNBAL" && (
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
                </Tooltip>
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
          dataSource={props.data}
          className="receipt-payment-table"
          pagination={false}
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
              let dataType = "pdf";
              if (window.electron) {
                dataType = "html";
              }
              setPrintStatus(true);
              if (DrawerShow.TranType === "TRNFR") {
                getTransferPdf(
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
      <Modal
        width="fit-content"
        visible={showModal ? true : false}
        footer={null}
        onCancel={() => {
          setShowModal();
        }}
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 4 }}
        destroyOnClose={true}
        maskClosable={false}
      >
        <TransferAndAjustments
          TranType={"CHQ"}
          onBackPress={() => {
            setShowModal();
          }}
          refrehPage={() => {
            props.refrehPage();
          }}
          data={showModal}
        />
      </Modal>
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
