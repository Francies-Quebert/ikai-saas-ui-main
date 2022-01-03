import React from "react";

const AddressCard = props => {
  return (
    <div
      className={`card m-t-10 m-b-10 ${props.isSelected ? "card-click" : ""}`}
    >
      {props.isShowAddNew && (
        <div className="blog-box blog-list row" style={{height:100}} onClick={props.onAddNewClick}>
          <div className="col-sm-12">
            <div className="blog-details p-15" style={{display: 'flex' , justifyContent: 'center'}}>
              <h6 className="m-b-5" style={{fontSize:16}}>
              <i className="fa fa-plus" style={{fontSize:16}}></i>  Add Address
              </h6>
              {/* <div className="blog-date digits"></div> */}
            </div>
          </div>
        </div>
      )}
      {!props.isShowAddNew && (
        <div className="blog-box blog-list row" onClick={props.onServiceSelect}>
          <div className="col-sm-12">
            <div className="blog-details p-15">
              <h6 className="m-b-5">
              <i className="icofont icofont-address-book" style={{fontSize:20}}> </i>{props.building}
                {props.landmark ? `, ${props.landmark}` : ""}
              </h6>
              <div className="blog-date digits">{props.detail}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
