import React, { useEffect, useState } from "react";
import { FormOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Card, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setFormCaption } from "../../../../store/actions/currentTran";
import CardHeader from "../../../common/CardHeader";
import SystemSequenceConfigNewCard from "./components/SystemSequenceConfigNewCard";
import { hasRight } from "../../../../shared/utility";
import { fetchGetSequenceTrans } from "../../../../services/system-sequence";

const SystemSequenceConfigNewPage = () => {
  const dispatch = useDispatch();
  //useState

  const [AeData, setAeData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tranTypes, setTranTypes] = useState([]);

  //useSelector
  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);

  //useEffect
  useEffect(() => {
    setIsLoading(true);
    dispatch(setFormCaption(55));
    fetchSystemConfigData();
  }, []);

  //fecthData
  const fetchSystemConfigData = async () => {
    fetchGetSequenceTrans(CompCode)
      .then((res) => {
        console.log(res);
        if (res.length > 0) {
          setTranTypes(res);
        } else {
          setTranTypes([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {!AeData && <CardHeader title={currTran.formTitle} />}
      {!AeData && (
        <Card bodyStyle={{ padding: 5 }}>
          <>
            <Row style={{ marginBottom: 5 }}>
              <Button
                loading={isLoading}
                type="primary"
                name="add"
                onClick={() => {
                  setAeData({ entryMode: "A" });
                }}
                icon={<PlusCircleOutlined />}
                // disabled={hasRight(currTran.moduleRights, "ADD")}
              >
                Add System Sequence Config
              </Button>
            </Row>
            <Row>
              {tranTypes.map((row, l_index) => {
                return (
                  <Card
                    loading={isLoading}
                    bordered={false}
                    key={l_index}
                    style={{
                      width: 350,
                      borderRadius: 11,
                      margin: 22,
                      textAlign: "center",
                      boxShadow: "5px 5px 12px darkgrey",
                    }}
                    bodyStyle={{ padding: "10px 15px" }}
                  >
                    <Row
                      gutter={[8, 8]}
                      style={{
                        fontSize: 15,

                        fontWeight: 500,
                        borderBottom: "1px solid #000000",
                        marginBottom: 10,
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ marginBottom: 10 }}>{row.TranDesc}</div>
                    </Row>
                    <Row
                      gutter={[8, 8]}
                      style={{
                        fontSize: 15,

                        fontWeight: 500,
                        display: "contents",
                      }}
                    >
                      <div style={{ display: "flex", flex: 1 }}>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          Sequence Mode
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          {row.ConfigTypeDesc}
                        </div>
                      </div>{" "}
                      <div style={{ display: "flex", flex: 1 }}>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          Last Generated No. :
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          {row.Preffix}
                          {row.LastGenNo}
                        </div>
                      </div>
                      <div style={{ display: "flex", flex: 1 }}>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          Status :
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          {row.IsActive.data[0] === 1 ? (
                            <p style={{ color: "#52C41A" }}>Active</p>
                          ) : (
                            <p style={{ color: "#FF0000" }}>In-Active</p>
                          )}
                        </div>
                      </div>
                    </Row>

                    <Row
                      style={{
                        borderTop: "1px solid #000",

                        justifyContent: "center",
                      }}
                    >
                      <Button
                        type="link"
                        disabled={hasRight(currTran.moduleRights, "EDIT")}
                        icon={<FormOutlined />}
                        style={{
                          fontWeight: 600,

                          color: "#1890FF",
                          fontSize: 14,
                        }}
                        onClick={() => {
                          setAeData({ entryMode: "E", formData: row });
                        }}
                      >
                        Edit
                      </Button>
                    </Row>
                  </Card>
                );
              })}
            </Row>
          </>
        </Card>
      )}

      <>
        {AeData && (
          <SystemSequenceConfigNewCard
            onBackPress={() => setAeData()}
            formData={AeData.formData}
            entryMode={AeData.entryMode}
            onSavePress={(val) => {
              setIsLoading(true);
              fetchSystemConfigData();
            }}
          />
        )}
      </>
    </>
  );
};

export default SystemSequenceConfigNewPage;
