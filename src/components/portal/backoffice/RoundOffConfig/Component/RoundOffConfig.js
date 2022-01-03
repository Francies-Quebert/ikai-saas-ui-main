import React, { useState, useEffect } from "react";
import { Input, Button, Select, Radio, Skeleton, notification } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  getRoundOffConfigData,
  UpdtRounOffConfig,
} from "../../../../../services/round-off-config";
import { useDispatch, useSelector } from "react-redux";
import { setFormCaption } from "../../../../../store/actions/currentTran";
const { Option } = Select;

const RoundOffConfig = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const currTran = useSelector((state) => state.currentTran);
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  useEffect(() => {
    setIsLoading(true);
    dispatch(setFormCaption(116));
    fetchRoundOffData();
  }, []);

  const fetchRoundOffData = () => {
    getRoundOffConfigData(CompCode).then((res) => {
      let tempData = [];
      res.forEach((element, idx) => {
        tempData.push({ ...element, key: idx, isDirty: false });
      });
      setData(tempData);
      setIsLoading(false);
    });
  };

  const roundOffType = [
    {
      Name: "Round-Off",
      Value: "R",
    },
    {
      Name: "Ceiling",
      Value: "C",
    },
    {
      Name: "Floor",
      Value: "F",
    },
  ];
  return (
    <>
      {isLoading && (
        <div style={{ height: 200 }} className="card-sales">
          <Skeleton active={isLoading} />
        </div>
      )}
      <div className="flex">
        {!isLoading &&
          data.length > 0 &&
          data.map((xx, inx) => {
            return (
              <>
                <div className="flex">
                  <div className="w-auto h-auto bg-gray-100 shadow m-2 p-2 rounded-lg">
                    <div className="flex justify-between border-b">
                      <div className="flex flex-1 font-semibold text-sm py-1">
                        {xx.TransactionTypeDesc}
                      </div>
                      <div className="flex justify-around">
                        <Radio.Group
                          defaultValue="Y"
                          value={xx.IsEnabled}
                          buttonStyle="solid"
                          onChange={(e) => {
                            console.log(e.target.value);
                            let tempData = [...data];
                            const findIndex = data.findIndex(
                              (aa) => aa.key === xx.key
                            );
                            tempData[findIndex].IsEnabled = e.target.value;
                            tempData[findIndex].isDirty = true;
                            setData(tempData);
                          }}
                        >
                          <Radio.Button value="Y">Enable</Radio.Button>
                          <Radio.Button value="N">Disable</Radio.Button>
                        </Radio.Group>
                      </div>
                    </div>
                    <div className="flex justify-between py-1">
                      <div className="flex border py-1 justify-around w-20">
                        Type
                      </div>
                      <div className="flex justify-around">
                        <Select
                          disabled={xx.IsEnabled === "N"}
                          style={{ width: "194px" }}
                          placeholder="Select Payment Type"
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                          value={xx.RoundType}
                          onChange={(val) => {
                            let tempData = [...data];
                            const findIndex = data.findIndex(
                              (aa) => aa.key === xx.key
                            );
                            tempData[findIndex].RoundType = val;
                            tempData[findIndex].isDirty = true;
                            setData(tempData);
                          }}
                        >
                          {roundOffType.length > 0 &&
                            roundOffType.map((xx, ii) => {
                              return (
                                <Option key={ii} value={xx.Value}>
                                  {xx.Name}
                                </Option>
                              );
                            })}
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-between border-b py-1">
                      <div className="flex border py-1 justify-around w-20">
                        {xx.RoundType === "R"
                          ? "Deci Value"
                          : xx.RoundType === "C"
                          ? "Ceil Value"
                          : xx.RoundType === "F"
                          ? "Floor Value"
                          : " "}
                      </div>
                      <div className="flex justify-around">
                        <Input
                          disabled={xx.IsEnabled === "N"}
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Enter Round-Off Value"
                          value={xx.RoundValue}
                          onChange={(e) => {
                            let tempData = [...data];
                            const findIndex = data.findIndex(
                              (aa) => aa.key === xx.key
                            );
                            if (e.target.value) {
                              tempData[findIndex].RoundValue = e.target.value;
                              tempData[findIndex].isDirty = true;
                              setData(tempData);
                            } else {
                              tempData[findIndex].RoundValue = 0;
                              tempData[findIndex].isDirty = true;
                              setData(tempData);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-2/4">
                        <Button
                          className="bg-green-600 w-full"
                          icon={
                            <CheckOutlined
                              style={{
                                color: "#fff",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            />
                          }
                          loading={isLoading}
                          type="primary"
                          onClick={() => {
                            // onFinish();
                            setIsLoading(true);
                            if (data.length > 0) {
                              let tempData = data.find(
                                (aa) => aa.key === xx.key
                              );
                              let finaldata = {
                                CompCode: tempData.CompCode,
                                ProjectType: tempData.ProjectType,
                                TransactionType: tempData.TransactionType,
                                IsEnabled: tempData.IsEnabled,
                                RoundValue: tempData.RoundValue,
                                RoundType: tempData.RoundType,
                                Updt_Usr: "saurav",
                              };
                              UpdtRounOffConfig(CompCode, finaldata).then(
                                (res) => {
                                  // console.log(res, "donew");
                                  if (res.message === "successful") {
                                    notification.success({
                                      message: "Data Saved",
                                      description: "Data saved successfully!!!",
                                    });
                                    fetchRoundOffData();
                                  }
                                }
                              );
                            }
                          }}
                        ></Button>
                      </div>
                      <div className="flex flex-1">
                        <Button
                          className="bg-red-600 w-full"
                          icon={
                            <CloseOutlined
                              style={{
                                color: "#fff",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            />
                          }
                          type="primary"
                          onClick={() => {
                            fetchRoundOffData();
                          }}
                        ></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
};

export default RoundOffConfig;
