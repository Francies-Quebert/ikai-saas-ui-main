import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import four from "../../../assets/images/user/4.jpg";
import { CheckCircle, Circle } from "react-feather";
import moment from "moment";
const OrderSchedulesVisitsItem = (props) => {
  const SelectComponent = props.IsSelected ? CheckCircle : Circle;
  const empData = useSelector((state) =>
    state.employeeMaster.employeeMasters.find((ii) => ii.Id === props.EmpId)
  );
  const statusColor = useSelector(
    (state) => state.AppMain.otherMasterOrderStatus
  );

  // useEffect(() => {

  // }, [empData]);

  return (
    <>
      <tr key={props.ScheduleId}>
        <td>
          <div
            className="col-2 pad-custom  justify-content-center align-items-center"
            onClick={props.onScheduleSelect}
            style={{ cursor: "pointer" }}
          >
            <SelectComponent
              size={20}
              className={props.IsSelected ? "font-primary" : null}
            />
          </div>
        </td>
        <td>
          <div className="d-inline-block align-self-center">
            {!props.EmpName && !props.mobileNo && (
              <div className="d-inline-block">
                <span className="f-w-600">
                  <button
                    className={`btn btn-primary btn-sm ${
                      moment(props.ScheduleDate).format("YYYY/MM/DD") >=
                        moment().format("YYYY/MM/DD") && props.Status !== "COT"
                        ? ``
                        : `disabled`
                    }`}
                    style={{ padding: "6px 6px", fontSize: 10 }}
                    // href="javascript:void(0)"
                    disabled={
                      moment(props.ScheduleDate).format("YYYY/MM/DD") >=
                        moment().format("YYYY/MM/DD") && props.Status !== "COT"
                        ? ``
                        : `disabled`
                    }
                    onClick={props.onButtonClick}
                  >
                    <i className="fa fa-pencil"></i> Assign Atttendant
                  </button>
                  {/* <i className="fa fa-pencil" onClick={props.onButtonClick}></i> */}
                </span>
              </div>
            )}
            {props.EmpName && props.mobileNo && (
              <div>
                <img
                  className="img-radius img-40 align-top m-r-15 rounded-circle"
                  src={empData.ProfilePicture ? empData.ProfilePicture : null}
                  alt=""
                />
                <div className="d-inline-block">
                  <span className="f-w-600">
                    {props.EmpName === null
                      ? "Attendant Not Assigned"
                      : props.EmpName}
                  </span>
                  <p>
                    {props.mobileNo === null
                      ? "Attendant Not Assigned"
                      : `+91 ${props.mobileNo}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </td>
        <td style={{ textAlign: "center" }}>
          <div className="d-inline-block text-center">
            <span className="f-w-600">
              {moment(props.ScheduleDate).format("DD/MM/YYYY")}
            </span>
            <p>{props.slotname}</p>
          </div>
        </td>
        <td className="text-center">
          <div className="d-inline-block text-center">
            <span className="f-w-600">
              {!props.Remark
                ? "No Remark"
                : props.Remark.length > 15
                ? `${props.Remark.substring(0, 15)}...`
                : props.Remark}
              <br />
            </span>
            {moment(props.ScheduleDate).format("YYYY/MM/DD") >=
              moment().format("YYYY/MM/DD") && props.Status !== "COT" ? (
              <span className="readMore" onClick={props.onButtonClick}>
                <u style={{ fontSize: 10 }}>read more</u>
              </span>
            ) : (
              ``
            )}

            {/* <p>Remark</p> */}
          </div>
        </td>
        <td>
          <div className="d-inline-block text-center">
            <span className="f-w-600">
              <i
                className={`fa fa-circle f-12`}
                style={{
                  color: `${
                    statusColor.length > 0
                      ? statusColor.find((ii) => ii.ShortCode === props.Status)
                          .SysOption1
                      : `green`
                  }`,
                }}
              />
            </span>
            <p>{props.StatusDesc}</p>
          </div>
        </td>
        <td>
          {
            <div className="d-inline-block align-self-center">
              <div className="d-inline-block">
                <span className="f-w-600">
                  <button
                    className={`btn btn-primary btn-sm  ${
                      moment(props.ScheduleDate).format("YYYY/MM/DD") >=
                        moment().format("YYYY/MM/DD") && props.Status !== "COT"
                        ? ``
                        : `disabled`
                    }`}
                    style={{ padding: "6px 6px", fontSize: 10 }}
                    // href="javascript:void(0)"
                    onClick={props.onButtonClick}
                    disabled={
                      moment(props.ScheduleDate).format("YYYY/MM/DD") >=
                        moment().format("YYYY/MM/DD") && props.Status !== "COT"
                        ? false
                        : true
                    }
                  >
                    <i className="fa fa-pencil"></i> Edit
                  </button>
                  {/* <i className="fa fa-pencil" onClick={props.onButtonClick}></i> */}
                </span>
                {/* <p>Total marks</p> */}
              </div>
              {props.EmpId && (
                <div className="d-inline-block">
                  <span className="f-w-600">
                    <button
                      className={`btn btn-warning btn-sm m-l-5 ${
                        moment(props.ScheduleDate).format("YYYY/MM/DD") >=
                          moment().format("YYYY/MM/DD") &&
                        props.Status !== "COT"
                          ? ``
                          : `disabled`
                      }`}
                      style={{ padding: "6px 6px", fontSize: 10 }}
                      // href="javascript:void(0)"
                      onClick={props.onSendOtpClick}
                      disabled={
                        moment(props.ScheduleDate).format("YYYY/MM/DD") >=
                          moment().format("YYYY/MM/DD") &&
                        props.Status !== "COT"
                          ? false
                          : true
                      }
                    >
                      <i className="fa fa-send"></i>
                      {"  "}Send OTP
                    </button>
                    {/* <i className="fa fa-pencil" onClick={props.onButtonClick}></i> */}
                  </span>
                  {/* <p>Total marks</p> */}
                </div>
              )}
            </div>
          }
        </td>
      </tr>
    </>
  );
};

export default OrderSchedulesVisitsItem;
