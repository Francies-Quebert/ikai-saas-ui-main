import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updtSupportTicket } from "../../../store/actions/supportTicket";
import { reInitialize } from "../../../store/actions/currentTran";
import renderHTML from "react-render-html";

import { Button } from "antd";
import moment from "moment";
const SupportDetailCard = (props) => {
  const dispatch = useDispatch();
  const currentTran = useSelector((state) => state.currentTran);
  const [remark, setRemark] = useState(props.data.Remark);
  const [status, setStatus] = useState(props.data.statusCode);
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
  }, [currentTran.error, currentTran.isSuccess]);

  return (
    <div className="card col-md-12 m-5">
      <div className="card-header p-l-5">
        <h5>View Support Detail</h5>
      </div>
      <div className="blog-box blog-list row">
        <div
          className="ribbon ribbon-right ribbon-right"
          style={{ backgroundColor: props.statusBackColor }}
        >
          <label style={{ color: props.statusForeColor }}>
            {props.data.StatusDesc}
          </label>
        </div>
        <div className="col-sm-11">
          <div className="blog-details">
            <div className="blog-date digits">
              <span>Ticket No. #{props.data.TicketNo}</span> &nbsp;&nbsp;
              {props.data.HelpType}
              &nbsp;
            </div>
            <h6>{props.data.HelpTitle}</h6>

            <div>
              <ul className="blog-social">
                <li>{props.data.name}</li>
                <li style={{ borderRight: "1px solid #777", paddingRight: 15 }}>
                  {props.data.mobile}
                </li>
                <li>{moment(props.data.crt_dttm).format("DD/MM/YYYY")}</li>
                {props.data.orderNo === null ? null : (
                  <li>Order No:{props.data.orderNo}</li>
                )}
              </ul>
              <hr />
              <div>{props.data.HelpDesc}</div>
              {props.data.CustomHelpText === null ? null : (
                <div>
                  <strong>Customer Query:</strong>&nbsp;&nbsp;
                  <i>{renderHTML(props.data.CustomHelpText)}</i>
                </div>
              )}
              <div className="form-group mb-0">
                <label htmlFor="exampleFormControlTextarea4">Remark</label>
                <textarea
                  disabled={
                    props.data.statusCode === "RES" ||
                    props.data.statusCode === "REJ"
                      ? true
                      : false
                  }
                  className="form-control"
                  //   id="exampleFormControlTextarea4"
                  onChange={(e) => {
                    setRemark(e.target.value);
                  }}
                  value={props.data.Remark}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                {/* <label htmlFor="exampleFormControlSelect9">Current Status</label> */}
                <select
                  className="form-control digits m-t-10"
                  defaultValue={props.data.statusCode}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  {supportStatus &&
                    supportStatus.map((item) => (
                      <option
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
                      </option>
                    ))}
                </select>
              </div>
              <hr />
              <div className="m-b-10">
                <Button
                  // disabled={formik.isSubmitting}
                  type="primary"
                  name="submit"
                  style={{ marginRight: 10 }}
                  // className="btn btn-primary mr-1"
                  onClick={() => {
                    dispatch(
                      updtSupportTicket(props.data.TicketNo, status, remark)
                    );
                  }}
                >
                  Save
                </Button>

                <Button
                  danger
                  onClick={() => {
                    // dispatch(reInitialize());
                    props.onBackPress();
                  }}
                  // className="btn btn-secondary ml-1"
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

export default SupportDetailCard;
