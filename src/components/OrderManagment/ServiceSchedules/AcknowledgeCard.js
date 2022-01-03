import React, { useState } from "react";
import { Descriptions, Input, Checkbox, Divider, Button } from "antd";
import { AcknowledeSchedule } from "../../../services/service-managment/service-management";
import { useSelector, useDispatch } from "react-redux";

const AcknowledgeCard = (props) => {
  const l_LoginUserInfo = useSelector((state) => state.LoginReducer.userData);
  const { TextArea } = Input;
  const [checked, setChecked] = useState(true);
  const [remark, setRemark] = useState();

  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  // console.log(props.data, "data");
  return (
    <div>
      <Descriptions bordered style={{ padding: "5px" }}>
        <Descriptions.Item label="Remark" span={3}>
          <TextArea
            rows={5}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Ask Feedback" span={3}>
          <Checkbox
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
            }}
          ></Checkbox>
        </Descriptions.Item>
      </Descriptions>
      <Divider style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ padding: "0px 6px 5px" }}>
        <Button
          type="primary"
          onClick={() => {
            let data;
            if (props.data) {
              data = {
                CompCode: CompCode,
                OrderId: props.data.orderid,
                ScheduleId: props.data.ScheduleId,
                AckRemark: remark,
                AskFeedback: checked,
                UpdtUsr: l_LoginUserInfo.username,
              };
              AcknowledeSchedule(data).then((res) => {
                if (res.data && res.data.message === "successful") {
                  props.onBackPress(props.data.orderid);
                }
              });
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default AcknowledgeCard;
