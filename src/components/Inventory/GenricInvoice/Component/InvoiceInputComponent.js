import React from "react";

const InvoiceInputComponent = (props) => {
  return (
    <div className="gen-invoice-inp-container">
      <div className="gen-invoice-label">{props.label}</div>
      <div className="gen-invoice-input">{props.children}</div>
    </div>
  );
};

export default InvoiceInputComponent;
