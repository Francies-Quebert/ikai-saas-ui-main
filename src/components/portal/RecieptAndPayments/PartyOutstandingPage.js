import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  message,
  Radio,
  Row,
  Select,
  DatePicker,
} from "antd";
import CardHeader from "../../common/CardHeader";
import _ from "lodash";
import { setFormCaption } from "../../../store/actions/currentTran";
import { RetweetOutlined, SearchOutlined } from "@ant-design/icons";
import PartyOutstaningComp from "./Components/PartyOutstaningComp";
import { fetchReceiptAndPaymentReferenceHelp } from "../../../services/receipts-payments";
import {
  fetchDataPartyOutstandingDetail,
  fetchDataPartyOutstandingSummary,
} from "../../../services/party-outstanding";
import moment from "moment";

const PartyOutstandingPage = () => {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const currentTran = useSelector((state) => state.currentTran);
  const [party, setParty] = useState(null);
  const [partyType, setPartyType] = useState("A");
  const [helpRef, setHelpRef] = useState([]);
  const [outStandingSummary, setOutStandingSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const [DateRange, setDateRange] = useState([null, null]);
  const l_ConfigDateFormat = useSelector((state) =>
    state.AppMain.appconfigs.find((kk) => kk.configCode === "DTFORMAT")
  );

  useEffect(() => {
    //Set Form Caption
    setIsLoading(true);
    dispatch(setFormCaption(103));

    //get Party
    fetchReceiptAndPaymentReferenceHelp(CompCode).then((res) => {
      if (res.length > 0) {
        setHelpRef(res.filter((i) => i.DataSetType === "PARTY"));
      }
    });
  }, []);

  const fnDefault = () => {
    try {
      fetchDataPartyOutstandingSummary(
        CompCode,
        party,
        DateRange[0] !== null
          ? moment(DateRange[0]).format("YYYY-MM-DD")
          : null,
        DateRange[1] !== null ? moment(DateRange[1]).format("YYYY-MM-DD") : null
      ).then((hdrRes) => {
        // fetchDataPartyOutstandingDetail(
        //   CompCode,
        //   party,
        //   DateRange[0] !== null
        //     ? moment(DateRange[0]).format("YYYY-MM-DD")
        //     : null,
        //   DateRange[1] !== null
        //     ? moment(DateRange[1]).format("YYYY-MM-DD")
        //     : null
        // ).then((dtlRes) => {
        //   if (hdrRes.length > 0) {
        //     let tempData = [];

        //     if (dtlRes.length > 0) {
        //       hdrRes.forEach((row) => {
        //         tempData.push({
        //           AddInfo1: row.AddInfo1,
        //           Credit: row.Credit,
        //           Debit: row.Debit,
        //           Outstanding: row.Outstanding,
        //           PartyId: row.PartyId,
        //           PartyName: row.PartyName,
        //           key: row.key,
        //           DetailData: [...dtlRes],
        //         });
        //       });
        //     } else {
        //       hdrRes.forEach((row) => {
        //         tempData.push({
        //           AddInfo1: row.AddInfo1,
        //           Credit: row.Credit,
        //           Debit: row.Debit,
        //           Outstanding: row.Outstanding,
        //           PartyId: row.PartyId,
        //           PartyName: row.PartyName,
        //           key: row.key,
        //           DetailData: [],
        //         });
        //       });
        //     }
        //   } else {
        //   }
        // });

        if (hdrRes.length > 0) {
          console.log(hdrRes, "hdr");
          setOutStandingSummary(hdrRes);
        } else {
          setOutStandingSummary([]);
        }
      });
    } catch (error) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Col lg={24} xl={24}>
        <CardHeader title={currentTran.formTitle} />
        <Card bodyStyle={{ padding: "7px 5px" }}>
          <Row style={{ display: "block" }}>
            <Col style={{ flex: 1 }} className="custom-party-outstanding-card">
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col style={{ display: "flex" }}>
                  <Col
                    style={{
                      marginRight: 5,
                      marginBottom: 5,
                      alignSelf: "center",
                    }}
                  >
                    Party :
                  </Col>
                  <Col style={{ marginRight: 5, width: 250, marginBottom: 5 }}>
                    <Select
                      allowClear
                      showSearch
                      value={party}
                      placeholder="Select Party"
                      className="custom-party-outstanding-select-input"
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setParty(value);
                      }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {helpRef.length > 0 &&
                        helpRef
                          .filter(
                            (i) => partyType === "A" || i.UserType === partyType
                          )
                          .map((item) => {
                            return (
                              <Select.Option
                                key={item.RefId}
                                value={item.RefId}
                              >
                                {`${item.RefName} ${
                                  item.AddInfo !== null
                                    ? `(${item.AddInfo})`
                                    : ""
                                }`}
                              </Select.Option>
                            );
                          })}
                      <Select.Option key={"ALL"} value={null}>
                        All
                      </Select.Option>
                    </Select>
                  </Col>
                </Col>
                <Col style={{ marginRight: 5, marginBottom: 5 }}>
                  <Radio.Group
                    className="custom-party-outstanding-select-input"
                    buttonStyle="solid"
                    value={partyType}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setPartyType(e.target.value);
                      setParty(null);
                    }}
                  >
                    <Radio.Button value={"A"}>All</Radio.Button>
                    <Radio.Button value={"U"}>Customers</Radio.Button>
                    <Radio.Button value={"P"}>Suppliers</Radio.Button>
                  </Radio.Group>
                </Col>{" "}
                <Col style={{ marginRight: 5, marginBottom: 5 }}>
                  <RangePicker
                    // className="custom-party-outstanding-select-input"
                    // size="small"
                    style={{
                      border: "1px solid var(--app-theme-color) ",
                      height: 34,
                    }}
                    onChange={(val, aa) => {
                      // console.log(val, "date");
                      setDateRange(val !== null ? [...val] : [null, null]);
                    }}
                    format={l_ConfigDateFormat.value1}
                    defaultValue={DateRange}
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    style={{ marginRight: 5, marginBottom: 5 }}
                    icon={<SearchOutlined />}
                    onClick={() => {
                      if (_.includes([""], party)) {
                        message.error("Please Select Party");
                      } else {
                        fnDefault();
                      }
                    }}
                  >
                    Search
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginRight: 5, marginBottom: 5 }}
                    icon={<RetweetOutlined />}
                    onClick={() => {
                      setParty(null);
                      setPartyType("A");
                      setOutStandingSummary([]);
                    }}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col style={{ flex: 1 }}>
              {!isLoading && outStandingSummary.length > 0
                ? outStandingSummary.map((item) => {
                    return (
                      <PartyOutstaningComp
                        key={item.PartyId}
                        data={item}
                        FromDate={
                          DateRange[0] !== null
                            ? moment(DateRange[0]).format("YYYY-MM-DD")
                            : null
                        }
                        ToDate={
                          DateRange[1] !== null
                            ? moment(DateRange[1]).format("YYYY-MM-DD")
                            : null
                        }
                      />
                    );
                  })
                : ""}
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};

export default PartyOutstandingPage;
