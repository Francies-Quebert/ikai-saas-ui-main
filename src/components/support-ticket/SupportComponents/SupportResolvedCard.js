import React, { Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

const SupportResolvedCard = props => {
  const [fromDate, setFromDate] = useState(moment(new moment())._d);
  const [toDate, setToDate] = useState(moment(new moment())._d);

  return (
    <div className="card-header p-2 ">
      <div className="col-md-12">
        <div className="row">
          <div className="d-flex justify-content-center align-items-center">
            <label className="col-form-label">
              <strong>From:</strong>
            </label>
          </div>
          <div className="col-md-2 P-0">
            <DatePicker
              className="form-control digits date-style"
              name="date"
              id="date"
              format="MM/DD/YYYY"
              selected={fromDate}
              onChange={evt => {
                setFromDate(evt);
              }}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <label className="col-form-label">
              <strong>To:</strong>
            </label>
          </div>
          <div className="col-md-2 P-0">
            <DatePicker
              className="form-control digits date-style"
              name="date"
              id="date"
              format="MM/DD/YYYY"
              selected={toDate}
              onChange={evt => {
                setToDate(evt);
              }}
            />
          </div>
          <div className="col-md-2 P-0">
            <button
              className="btn btn-primary "
              type="submit"
              onClick={() =>
                props.onSearchClick(
                  moment(fromDate).format("YYYY-MM-DD"),
                  moment(toDate).format("YYYY-MM-DD")
                )
              }
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportResolvedCard;
