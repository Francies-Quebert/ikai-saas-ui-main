import React, { Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
const ScheduleSelect = () => {
  const [startDate, setStartDate] = useState(moment(new moment())._d);
  const [endDate, setEndDate] = useState(moment(new moment()).d);
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row ">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                
                    {/* <div className="date-picker"> */}
                      <form className="theme-form">
                      <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Select Date
                          </label>
                          <div className="col-md-9">
                          <DatePicker
                            className="form-control digits"
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                          />
                        </div>
                        </div>
                        {/* <div className="form-row p-t-5">
                          <label className="col-sm-3 col-form-label">
                            To date
                          </label>
                          <DatePicker
                            className="form-control digits"
                            selected={startDate}
                          />
                        </div> */}
                        <div className="form-group row">
                          <label className="col-sm-3 col-form-label">
                            Select Slots
                          </label>
                          <div className="col-sm-9">
                          <div className= "slotStyle" >
                            <h6 style={{ paddingTop: 7 }}>9:00AM</h6>
                          </div>
                          </div>
                          </div>

                        {/* <div
                          className="card-body btn-showcase p-0 p-b-15"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end"
                          }}
                        >
                          <button
                            className="btn btn-square btn-primary "
                            type="button"
                          >
                            Next
                          </button>
                        </div> */}
                      </form>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
      </div>
    </Fragment>
  );
};

export default ScheduleSelect;
