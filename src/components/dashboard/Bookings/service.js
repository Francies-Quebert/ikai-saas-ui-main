import React, { Fragment, useState } from "react";
import { controllers } from "chart.js";

const service = () => {
  return (
    <Fragment>
      {/* <div className="col-md-6">
        <div className="card">
          <div className="card-body p-0 p-t-10 p-b-10">
            <div className="row">
              <div className="col-md-4"style={{justifyContent:"center",alignItems: 'center',display:"flex"}}>
                <div className="faq-image product-img" >
                  <img className="img-fluid" src="https://project-lvk.s3.ap-south-1.amazonaws.com/service/water.jpg" />
                </div>
              </div>
              <div className="col-md-6">
                <h6>Test 1</h6>
                <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                  natoque penatibus et magnis dis parturient montes, nascetur
                  ridiculus mus.
                </p>
              </div>
              <div
                className="col-md-1"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <a href="#">
                  <i
                    className="fa fa-chevron-right"
                    style={{ color: "blue", fontSize: 30 }}
                  ></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="col-xl-4 col-md-4">
        <div className="card features-faq product-box" onClick={()=>{}}>
          <div className="faq-image product-img">
            <img
              className="img-fluid"
              src="https://project-lvk.s3.ap-south-1.amazonaws.com/service/water.jpg"
              alt=""
            />
            <div className="product-hover"></div>
          </div>
          <div className="card-body">
            <h6> Web Design</h6>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            </p>
          </div>
          <div className="card-footer">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <a href="#">
                <i
                  className="fa fa-chevron-right"
                  style={{ color: "blue", fontSize: 30 }}
                ></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default service;
