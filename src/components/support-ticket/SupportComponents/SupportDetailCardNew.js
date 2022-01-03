import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Select,
  Radio,
  Button,
  Row,
  Col,
  Card,
  Input,
  Typography,
  Divider,
  Spin,
} from "antd";
import CardHeader from "../../common/CardHeader";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { updtSupportTicket } from "../../../store/actions/supportTicket";
import { reInitialize } from "../../../store/actions/currentTran";
import renderHTML from "react-render-html";
import moment from "moment";

const SupportDetailCardNew = (props) => {
  const dispatch = useDispatch();
  const { Title } = Typography;
  const { TextArea } = Input;
  const { Option } = Select;
  const { Text } = Typography;
  const [isLoading, setIsLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const currentTran = useSelector((state) => state.currentTran);
  const [remark, setRemark] = useState(props.data ? props.data.Remark : "");
  const [status, setStatus] = useState(props.data ? props.data.statusCode: "");
  const supportStatus = useSelector(
    (state) => state.AppMain.otherMasterSupportStatus
  );

  useEffect(() => {
    if (currentTran.isSuccess) {
      dispatch(reInitialize());
      props.onBackPress();
    } else if (currentTran.error) {
      toast.error(currentTran.error);
    }
    setIsLoading(false);
  }, [currentTran.error, currentTran.isSuccess]);

  return (
    <div>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col span={24}>
            <CardHeader title={currentTran.formTitle} />
            <Card bordered={true} bodyStyle={{ paddingBottom: 5 }}>
              <Title level={2}>Ticket No #{props.data.TicketNo}</Title>
              <Title level={4}>{props.data.HelpTitle}</Title>
              <Text type="secondary">{props.data.HelpType}</Text>
              <Divider type="vertical" />
              <Text>{props.data.name}</Text>
              <Divider type="vertical" />
              <Text>{props.data.mobile}</Text>
              <Divider type="vertical" />
              <Text>{moment(props.data.crt_dttm).format("DD/MM/YYYY")}</Text>
              <Divider type="vertical" />
              {props.data.orderNo === null ? null : (
                <Text>Order No:{props.data.orderNo}</Text>
              )}
              <Divider />
              <Text strong>Description: </Text>
              <Text> {props.data.HelpDesc}</Text> <br />
              <Text strong>Customer Query: </Text>
              <Text>{renderHTML(props.data.CustomHelpText ? props.data.CustomHelpText : "")}</Text>
              <br />
              <Text strong>Remark:</Text>
              <TextArea
                rows={5}
                style={{ marginBottom: 5 }}
                value={remark}
                disabled={
                  props.data.statusCode === "RES" ||
                  props.data.statusCode === "REJ"
                    ? true
                    : false
                }
                onChange={(e) => {
                  setRemark(e.target.value);
                }}
              />
              <Select
                value={status}
                showSearch
                placeholder="Select a Remark"
                optionFilterProp="children"
                allowClear={true}
                style={{ width: "calc(30% - 8px)" }}
                onChange={(e) => {
                  setStatus(e);
                }}
              >
                {supportStatus &&
                  supportStatus.map((item) => (
                    <Option
                      disabled={
                        props.data.statusCode === "RES" ||
                        props.data.statusCode === "REJ"
                          ? true
                          : false
                      }
                      key={item.ShortCode}
                      value={item.ShortCode}
                    >
                      {item.MasterDesc}
                    </Option>
                  ))}
              </Select>
              <Divider />
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  dispatch(
                    updtSupportTicket(props.data.TicketNo, status, remark)
                  );
                }}
              >
                Save
              </Button>
              <Button
                type="primary"
                icon={<Icon component={RollbackOutlined} />}
                style={{ marginRight: 5 }}
                onClick={() => {
                  dispatch(reInitialize());
                  props.onBackPress();
                }}
              >
                Back
              </Button>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default SupportDetailCardNew;
