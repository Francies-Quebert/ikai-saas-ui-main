import React, { Fragment, useEffect, useState } from "react";
import AntDataTable from "../../common/AntDataTable";
import { setFormCaption } from "../../../store/actions/currentTran";
import { toast } from "react-toastify";
import {
  Form,
  Button,
  Spin,
  Row,
  Col,
  Card,
  Select,
  Radio,
  Switch,
  Empty,
} from "antd";
import _ from "lodash";
import CardHeader from "../../common/CardHeader";
import { useSelector, useDispatch } from "react-redux";
import {
  getHelpGrpUsrMapp,
  InsUpdtHelpGroupMapping,
} from "../../../services/help-group-mapp";
import { fetchOtherMasters } from "../../../store/actions/othermaster";
import ColumnPropertiesAnt from "../../../models/columnPropertiesAnt.js";
import Icon, {
  RollbackOutlined,
  LoadingOutlined,
  SaveOutlined,
  RetweetOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { hasRight } from "../../../shared/utility";
import Pdf from "react-to-pdf";
const { Option } = Select;
const ref = React.createRef();

const HelpGrpUsrMappPage = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState();
  const currTran = useSelector((state) => state.currentTran);
  const [selectedGroup, setSelectedGroup] = useState();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [helpMappData, setHelpMappData] = useState([]);
  const helpmaster = useSelector((state) => state.otherMaster.helpGroupMaster);
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  const onReset = () => {
    setSelectedGroup();
    setUserType();
    setHelpMappData([]);
  };

  useEffect(() => {
    dispatch(setFormCaption(36));
    dispatch(fetchOtherMasters("HLP"));
  }, []);

  useEffect(() => {
    if (currTran.lastSavedData) {
      toast.success("Data saved successfully...!");
      onReset();
    }
  }, [currTran.lastSavedData]);

  const columns = [
    // new ColumnPropertiesAnt("isDirty", "isDirty", false, false),
    new ColumnPropertiesAnt("Id", "Id", false, true, 80),
    new ColumnPropertiesAnt("HelpTitle", "Help Title", false, true, 250),
    {
      key: "IsVisible",
      title: "Visible",
      dataIndex: "IsVisible",
      render: (text, record, index) => (
        <Switch
          checkedChildren={"Show"}
          unCheckedChildren={"Hide"}
          defaultChecked={record.IsVisible}
          onChange={(checked) => {
            record.isDirty = true;
            record.IsVisible = checked;
          }}
        />
      ),
    },
  ];
  return (
    <div ref={ref}>
      <Spin indicator={antIcon} spinning={isLoading}>
        <Row>
          <Col span={16}>
            <CardHeader title={currTran.formTitle} />
            <Card bordered={true} bodyStyle={{ padding: 8, margin: 3 }}>
              <Select
                allowClear={true}
                disabled={helpMappData.length > 0}
                showSearch
                style={{ width: 300, marginRight: 10 }}
                placeholder="Select Group"
                value={selectedGroup}
                onChange={(val) => {
                  setSelectedGroup(val);
                }}
              >
                {helpmaster.map((ii) => (
                  <Option key={ii.Id} value={ii.ShortCode}>
                    {ii.MasterDesc}
                  </Option>
                ))}
              </Select>

              <Select
                disabled={helpMappData.length > 0}
                onChange={(val) => {
                  setUserType(val);
                }}
                value={userType}
                allowClear={true}
                showSearch
                style={{ width: 200, marginRight: 10 }}
                placeholder="Select User Type"
              >
                <Option value="U">Customer</Option>
                <Option value="A">Attendant</Option>
              </Select>

              <Button
                type="primary"
                disabled={
                  !selectedGroup || !userType || helpMappData.length > 0
                }
                onClick={() => {
                  setIsLoading(true);
                  getHelpGrpUsrMapp(CompCode, selectedGroup, userType)
                    .then((res) => {
                      setHelpMappData([]);
                      setHelpMappData(res);
                    })
                    .finally(() => {
                      setIsLoading(false);
                    });
                }}
              >
                Show
              </Button>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <Card bordered={true} bodyStyle={{ padding: 8, margin: 3 }}>
              <Card
                key="1"
                bordered={true}
                bodyStyle={{ padding: 8, margin: 3 }}
              >
                {helpMappData.length > 0 && (
                  <AntDataTable
                    data={helpMappData}
                    columns={columns}
                    pagination={{ pageSize: 25 }}
                  />
                )}
                {helpMappData.length === 0 && <Empty />}
              </Card>
              <Card
                key="3"
                bordered={true}
                bodyStyle={{ padding: 8, margin: 3 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  disabled={hasRight(currTran.moduleRights, "EDIT")}
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    let dtl = [];
                    helpMappData
                      .filter((item) => item.isDirty === true)
                      .map((item) => {
                        dtl.push({ Id: item.Id, IsVisible: item.IsVisible });
                      });
                    dispatch(
                      InsUpdtHelpGroupMapping(selectedGroup, userType, dtl)
                    );
                    // console.log(selectedGroup, userType, dtl);
                  }}
                >
                  Save
                </Button>

                <Button
                  type="primary"
                  icon={<RetweetOutlined />}
                  style={{ marginRight: 5 }}
                  onClick={() => onReset()}
                >
                  Reset
                </Button>

                {/* <Pdf targetRef={ref} filename="code-example.pdf">
                  {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
                </Pdf> */}

                <Pdf
                  targetRef={ref}
                  filename={`${_.replace(currTran.formTitle, " ", "_")}.pdf`}
                >
                  {({ toPdf }) => (
                    <Button
                      type="primary"
                      icon={<Icon component={PrinterOutlined} />}
                      style={{ marginRight: 5 }}
                      onClick={toPdf}
                    >
                      Print
                    </Button>
                  )}
                </Pdf>
              </Card>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default HelpGrpUsrMappPage;
