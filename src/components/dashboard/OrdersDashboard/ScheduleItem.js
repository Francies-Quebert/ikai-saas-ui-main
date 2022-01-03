import React from "react";

const ScheduleItem = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body ">
              <div className="col-md-1 form-group m-0 d-inline-block ">
                <div className="checkbox checkbox-primary ">
                  <input id="solid3" type="checkbox" />
                  <label htmlFor="solid3"></label>
                </div>
              </div>
              <div className="col-md-4 d-inline-block align-self-center">
                <div className=" d-inline-block">
                  <span className="f-w-600">2020-03-03</span>
                </div>
              </div>
              <div className="col-md-4 d-inline-block text-center">
                <span className="f-w-600">9:00 AM</span>
              </div>
              <div className="col-md-3 d-inline-block text-center">
                <span className="f-w-600">Remark</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;
