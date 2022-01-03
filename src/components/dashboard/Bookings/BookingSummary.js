import React from "react";

const BookingSummary = props => {
  return (
    <div className="container-fluid">
      <div className="row ">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              {/* <div className="date-picker"> */}
              <form className="theme-form">
                <div className="form-group row">
                  <div className="col-12">
                    <strong className="col-form-label">Name: </strong>
                    Atul More
                  </div>

                  <div className="col-12">
                    <strong className="col-form-label">Address: </strong>
                    Duis nec nulla turpis. Nulla lacinia laoreet odio, non
                    lacinia nisl malesuada vel lacinia nisl malesuada vel
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
  );
};

export default BookingSummary;
