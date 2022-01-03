import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Form, Empty, Modal, Typography } from "antd";
import {
  PlusCircleOutlined,
  EditTwoTone,
  SaveTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import { getRecieptDtlData } from "../../../../services/reciept";
import RecieptDtlCard from "./RecieptDtlCard";
import moment from "moment";

const RecieptTableCard = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const { Text } = Typography;
  const PaymentMode = useSelector((state) => state.paymodeMaster.paymodeMaster);
  const currentTran = useSelector((state) => state.currentTran);

  useEffect(() => {
    getRecieptDtlData(props.recieptId).then((res) => {
      setDataSource(res);
    });
  }, []);

  useEffect(() => {
    if (currentTran.isSuccess) {
      // toast.success("Data saved successfully...!");
      setOpenModal(false);
      getRecieptDtlData(props.recieptId).then((res) => {
        setDataSource(res);
      });
    }
  }, [currentTran.isSuccess]);

  const handleDelete = (record) => {
    const newData = [...dataSource];
    newData[newData.findIndex((ii) => ii.key === record.key)] = record;
    setDataSource([...newData]);
    props.dtlData([...newData]);
    // setDataSource(newData.filter((item) => item.key !== key));
    // props.dtlData(dataSource);
  };

  const disableAction = (record) => {
    return moment(new moment()).format("YYYY-MM-DD") !==
      moment(record.ReceiptDate).format("YYYY-MM-DD")
      ? true
      : false;
  };

  let columns = [
    {
      title: "Sr.No.",
      width: 10,
      dataIndex: "key",
      align: "center",
      render: (value, record) => {
        return <Text>{parseInt(value) + 1}</Text>;
      },
    },
    {
      title: "Payment Mode",
      dataIndex: "PaymentMode",
      width: "20%",
      editable: true,
      render: (value, record) => {
        return (
          PaymentMode &&
          PaymentMode.filter((ii) => ii.PayCode === record.PaymentMode).map(
            (i) => {
              return <Text key={i.PayCode}>{i.PayDesc}</Text>;
            }
          )
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      width: "10%",
      render: (value, record) => {
        return <Text>{parseFloat(record.Amount).toFixed(2)}</Text>;
      },
    },

    {
      title: "Remark",
      dataIndex: "Remark",
      editable: true,
    },
    {
      width: "5%",
      align: "center",
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (text, record) => {
        return (
          <>
            {/* {console.log(record)} */}
            <a
              className={`edit-btn ${
                disableAction(record) || props.disable ? `disabled` : `edit-btn`
              }`}
              disabled={disableAction(record) || props.disable}
              style={{ marginRight: 10 }}
              onClick={() => {
                setOpenModal({ entrymode: "E", data: record });
              }}
            >
              <EditTwoTone />
            </a>
            <a
              className={`edit-btn ${
                disableAction(record) || props.disable ? `disabled` : `edit-btn`
              }`}
              disabled={disableAction(record) || props.disable}
              onClick={() => {
                record.isDeleted = true;
                handleDelete(record);
              }}
            >
              <DeleteTwoTone />
            </a>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Form form={form} component={false}>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          style={{ marginBottom: 5 }}
          disabled={props.disable}
          onClick={() => {
            setOpenModal({ entrymode: "A" });
          }}
        >
          New Row
        </Button>
        <Modal
          title="Reciept Mode"
          bodyStyle={{ padding: "0px 0px", height: "auto" }}
          width="50%"
          onCancel={() => {
            setOpenModal(false);
          }}
          visible={openModal}
          footer={null}
          destroyOnClose={true}
        >
          <RecieptDtlCard
            RecieptId={props.recieptId}
            data={openModal.data}
            entrymode={openModal.entrymode}
            dataSource={dataSource}
            onBackPress={() => setOpenModal(false)}
            onDialogSave={(newData) => {
              setOpenModal(false);
              if (openModal.entrymode === "A") {
                let {
                  Amount,
                  Remark,
                  PaymentMode,
                  key,
                  Id,
                  RecieptId,
                  SysOption1,
                  SysOption2,
                  SysOption3,
                  SysOption4,
                  SysOption5,
                } = newData;
                setDataSource([
                  ...dataSource,
                  {
                    Amount,
                    Remark,
                    PaymentMode,
                    key,
                    Id,
                    RecieptId,
                    SysOption1,
                    SysOption2,
                    SysOption3,
                    SysOption4,
                    SysOption5,
                  },
                ]);
                props.dtlData([
                  ...dataSource,
                  {
                    Amount,
                    Remark,
                    PaymentMode,
                    key,
                    Id,
                    RecieptId,
                    SysOption1,
                    SysOption2,
                    SysOption3,
                    SysOption4,
                    SysOption5,
                  },
                ]);
              } else if (openModal.entrymode === "E") {
                let hh = dataSource;
                hh[hh.findIndex((kk) => kk.key === newData.key)] = newData;
                setDataSource([...hh]);
                props.dtlData([...hh]);
              }
            }}
          />
        </Modal>
        <Table
          dataSource={dataSource.filter((i) => !i.isDeleted)}
          columns={columns}
          bordered={true}
          pagination={false}
          summary={(pageData) => {
            let totalAmount = 0;
            if (pageData.length > 0) {
              pageData.forEach(({ Amount, repayment }) => {
                totalAmount += parseFloat(Amount);
                props.TotalAmount(totalAmount);
              });
            } else {
              props.TotalAmount(totalAmount);
            }
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>Total Amount</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <Text strong>{totalAmount.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                  <Table.Summary.Cell></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </Form>
    </>
  );
};

export default RecieptTableCard;
