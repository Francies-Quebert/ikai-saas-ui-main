import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Upload,
  message,
  Divider,
  Select,
} from "antd";
import CardHeader from "../../../../common/CardHeader";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { fetchTablesMaster } from "../../../../../store/actions/tablesmaster";
import { fetchSectionMaster } from "../../../../../services/section-master";
import { InsConfigureTableQR } from "../../../../../services/configure-table-qr";
import swal from "sweetalert";

const { Option } = Select;

const ConfigTableQRCard = (props) => {
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const initialValues = {
    CompCode: CompCode,
    BranchCode: null,
    DeptType: null,
    TableSecCode: null,
    TableCode: null,
    TableName: null,
    SecretKey: null,
    IsActive: true,
  };
  const dispatch = useDispatch();
  const [sectionData, setSectionData] = useState();
  const [cardData, setCardData] = useState(initialValues);
  const tablesMaster = useSelector((state) => state.tablesMaster.tablesMaster);
  const l_loginUser = useSelector(
    (state) => state.LoginReducer.userData.username
  );

  useEffect(() => {
    dispatch(fetchTablesMaster());
    fetchSectionMaster(CompCode).then((res) => {
      setSectionData(res);
    });
  }, []);

  const onFinish = async () => {
    if (cardData) {
      const data = {
        CompCode: CompCode,
        BranchCode: props.data ? props.data.branch : "",
        DeptType: props.data ? props.data.department : "",
        TableSecCode: cardData.TableSecCode,
        TableCode: cardData.TableCode,
        TableName:
          tablesMaster.length > 0 &&
          tablesMaster.find((i) => i.ShortCode === cardData.TableCode).TableName,
        SecretKey: cardData.SecretKey,
        IsActive: cardData.IsActive,
        updt_usr: l_loginUser,
      };
      console.log(data, "sad");
      swal("Are you sure you want to save", {
        buttons: ["Cancel", "Yes!"],
      }).then((val) => {
        if (val) {
          // console.log(val,"saf")
          InsConfigureTableQR(CompCode, data).then((res) => {
            if (res.data.message === "successful") {
              swal("Data saved successfully   !!!", {
                icon: "success",
              });
              props.onSavePress(data);
              props.onBackPress();
            } else if (res.data.message === "unsuccessful") {
              swal(
                `${
                  res.data.code === "ER_DUP_ENTRY"
                    ? "Duplicate Entry"
                    : "Something Went Wrong Try Again Later...."
                }`,
                {
                  icon: "error",
                }
              );
            }
          });
        }
      });
    }
  };
  return (
    <>
      <Row>
        <Col flex={1}>
          <Card
            bordered={true}
            bodyStyle={{ paddingBottom: 5 }}
            // loading={isLoading}
          >
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> Section :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Select
                    showSearch
                    allowClear={true}
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    placeholder="Select Section Code"
                    value={cardData.TableSecCode}
                    // disabled={props.formData}
                    onChange={(val) => {
                      setCardData({
                        ...cardData,
                        TableSecCode: val,
                      });
                    }}
                  >
                    {sectionData &&
                      sectionData
                        .filter((i) => i.IsActive === true)
                        .map((h) => {
                          return (
                            <Option key={h.SecCode} value={h.SecCode}>
                              {h.SecDesc}
                            </Option>
                          );
                        })}
                  </Select>
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                <span style={{ color: "red" }}>*</span> Table Code :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Select
                    showSearch
                    allowClear={true}
                    style={{ width: "100%" }}
                    optionFilterProp="children"
                    placeholder="Select Table Code"
                    value={cardData.TableCode}
                    onChange={(val) => {
                      setCardData({
                        ...cardData,
                        TableCode: val,
                      });
                    }}
                  >
                    {tablesMaster &&
                      tablesMaster
                        .filter((i) => i.IsActive === true)
                        .map((h) => {
                          return (
                            <Option key={h.ShortCode} value={h.ShortCode}>
                              {h.TableName}
                            </Option>
                          );
                        })}
                  </Select>
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                Secret key :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Input
                    onChange={(e) => {
                      setCardData({
                        ...cardData,
                        SecretKey: e.target.value,
                      });
                    }}
                    value={cardData.SecretKey}
                    placeholder="Please input any scret key!"
                  />
                </div>
              </Col>
            </Row>
            <Row style={{ margin: "0px 0px 5px 0px" }}>
              <Col
                style={{ alignSelf: "center" }}
                xl={6}
                lg={6}
                md={6}
                sm={6}
                xs={24}
              >
                Status :
              </Col>
              <Col xl={14} lg={14} md={14} sm={14} xs={24}>
                <div style={{ display: "flex" }}>
                  <Radio.Group
                    onChange={(e) => {
                      setCardData({
                        ...cardData,
                        IsActive: e.target.value,
                      });
                    }}
                    value={cardData.IsActive}
                  >
                    <Radio value={true}>Active</Radio>
                    <Radio value={false}>InActive</Radio>
                  </Radio.Group>
                </div>
              </Col>
            </Row>
            <Divider
              type="horizontal"
              style={{ marginBottom: 5, marginTop: 5 }}
            />

            <Button
              type="primary"
              // loading={isLoading}
              htmlType="submit"
              icon={<SaveOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                onFinish();
                // setIsLoading(false);
              }}
              // loading={isLoading}
              // disable={isLoading}
            >
              Save
            </Button>

            <Button
              type="primary"
              icon={<RetweetOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => {
                setCardData(initialValues);
              }}
            >
              Reset
            </Button>

            <Button
              type="primary"
              icon={<Icon component={RollbackOutlined} />}
              style={{ marginRight: 5 }}
              //   onClick={props.onBackPress}
            >
              Back
            </Button>
            {/* {    setIsLoading(false)} */}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ConfigTableQRCard;
