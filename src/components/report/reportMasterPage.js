import React, { useState, useEffect } from "react";
import {
  SettingOutlined,
  FileAddOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import AppLoader from "../common/AppLoader";
import _ from "lodash";
// import ReportComponent from "./ReportMaster/ReportComponent";
import ReportComponent from "./ReportMaster/ReportComponentNew";
import { getReportHdrDetails } from "../../services/report-master";
import { Card, Typography, Collapse, Row, Col, Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../store/actions/currentTran";
import ReportPrintConfigComponent from "./ReportMaster/ReportPrintConfigComponent";

const { Panel } = Collapse;
const { Title } = Typography;
const ReportMasterPage = (props) => {
  const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState();
  const [reportData, setReportData] = useState();
  const [modal, setModal] = useState(false);
  const [report_Data_Hdr, setReport_Data_Hdr] = useState();
  const [report_Print_Hdr, setReport_Print_Hdr] = useState([]);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  useEffect(() => {
    dispatch(setFormCaption(72));
    getReportHdrDetails(CompCode).then((res) => {
      const reportType = Object.keys(_.groupBy(res, "ReportGroup"));
      let tempGroup = [];
      reportType.forEach((element) => {
        let tempFilter = res.filter((ii) => ii.ReportGroup === element);
        tempGroup.push({ group: element, data: tempFilter });
      });
      setReportData(tempGroup);
    });
  }, []);

  return (
    <div>
      {!selectedReport && (
        <>
          <Card
            bodyStyle={{ padding: "8px 15px", border: "1px solid #cecece" }}
          >
            <Title style={{ marginBottom: 0 }} level={4}>
              System Report's
            </Title>
            <Button
              style={{ marginRight: 7 }}
              icon={<PrinterOutlined />}
              onClick={() => {
                setModal(true);
              }}
            />
            {modal && (
              <Modal
                visible={modal}
                footer={false}
                bodyStyle={{ padding: "10px 10px" }}
                destroyOnClose={true}
                onCancel={() => {
                  setModal(false);
                }}
                width={"70%"}
              >
                <ReportPrintConfigComponent
                  colData={(report_Data_Hdr, report_Print_Hdr)}
                  reportId={props.reportId}
                  onBackPress={() => {
                    setModal(false);
                  }}
                  onFinish={() => {
                    setModal(false);
                    // message.success(
                    //   "Data saved Successfully, To See Changes Reload the Page",
                    //   10
                    // );
                  }}
                />
              </Modal>
            )}
          </Card>
          {reportData &&
            reportData.length > 0 &&
            reportData.map((ii) => {
              return (
                <Collapse
                  className="report-group"
                  defaultActiveKey={ii.group}
                  key={ii.group}
                  style={{ margin: "7px 0px" }}
                >
                  <Panel
                    // style={{ marginBottom: 5 }}
                    header={ii.group}
                    key={ii.group}
                  >
                    <Row gutter={[8, 8]}>
                      {ii.data.map((item) => {
                        return (
                          <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <div
                              className="report-card"
                              style={{
                                border: "1px solid #cecece",
                                padding: "15px",
                                display: "flex",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setSelectedReport(item);
                              }}
                            >
                              <div style={{ marginRight: 10 }}>
                                <FileAddOutlined />
                              </div>
                              <div>{item.ReportName}</div>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Panel>
                </Collapse>
              );
            })}
        </>
      )}
      {/* {!selectedReport && (
          <>
            <button
              onClick={() => {
                // onReportClick(1)
                setSelectedReport(1);
              }}
              type="button"
              className="ant-btn ant-btn-primary"
              style={{ marginRight: 7 }}
            >
              <span className="dataIcon" style={{ marginRight: 7 }}>
                <DatabaseOutlined />
              </span>
              <span>Order Summary: Service Type</span>
            </button>
            <button
              onClick={() => {
                // onReportClick(2)
                setSelectedReport(2);
              }}
              type="button"
              className="ant-btn ant-btn-primary"
              style={{ marginRight: 7 }}
            >
              <span className="dataIcon" style={{ marginRight: 7 }}>
                <DatabaseOutlined />
              </span>
              <span>Order Summary: Package Wise</span>
            </button>
          </>
        )}
        {selectedReport && (
          <ReportComponent
            showParamFilter={false}
            showBackButton={true}
            reportId={selectedReport}
            reportData={reportData}
            onBackPress={() => setSelectedReport()}
          />
        )} */}
      {selectedReport && (
        <ReportComponent
          hdrDtl={selectedReport}
          showParamFilter={false}
          showBackButton={true}
          reportId={selectedReport.ReportId}
          reportData={reportData}
          onBackPress={() => setSelectedReport()}
        />
      )}
    </div>
  );
};

export default ReportMasterPage;
