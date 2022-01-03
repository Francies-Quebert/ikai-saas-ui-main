import React, { Fragment } from "react";
import logo from "../../../assets/images/endless-logo2.png";

const UnlockUser = () => {
  return (
    <Fragment>
      <div className="page-wrapper ">
        {/* <div className="container-fluid"> */}
        {/* <!-- Unlock page start--> */}
        <div className="authentication-main company-auth-bg">
          <div className="row">
            <div className="col-md-12 p-0">
              <div className="auth-innerright">
                <div className="authentication-box">
                  <div className="card mt-4 p-4 mb-0">
                    <div className="text-center p-b-25">
                      <img src={logo} alt="" />
                    </div>
                    <form className="theme-form">
                      <div className="form-group">
                        <label className="col-form-label">
                          Enter your Company Code
                        </label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="*******"
                        />
                      </div>
                      <div
                        className="form-group form-row mb-2"
                        style={{ display: "flex", justifyContent: " flex-end" }}
                      >
                        <div className="col-md-3">
                          <button className="btn btn-primary" type="submit">
                            Login
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
          {/* <!-- Unlock page end--> */}
        </div>
      </div>
    </Fragment>
  );
};

export default UnlockUser;
