import React from "react";

const AddressSelect = props => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          {/* <div className="card"> */}
            <div className="card-body pt-2 pb-0 pl-0">
              <div className="form-group row">
                <label className=" col-md-2 col-form-label">Address:</label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Address"
                    id="address"
                    name="address"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className=" col-md-2 col-form-label"></label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="text"
                    id="addressOp1"
                    placeholder="Address Two (optional)"
                    name="addressOp1"
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-md-2 col-form-label"></label>
                <div className="col-md-10">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Address Three (optional)"
                    id="addressOp2"
                    name="addressOp2"
                  />
                </div>
              </div>
              <div
                className="card-body btn-showcase p-0 p-b-10"
                style={{
                  display: "flex",
                    
                  justifyContent: "flex-end"
                }}
              >
                <button className="btn btn-square btn-primary " type="button" onClick={()=>props.onAddressSave()}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default AddressSelect;
