import React, { useState, useEffect } from "react";
import Cryptr from "cryptr";

import { Input, Button, Row, Col, message, Typography } from "antd";
import { SyncOutlined } from "@ant-design/icons";
const { Paragraph } = Typography;

const { TextArea } = Input;
const EncrptCustomerSelfOrderForm = () => {
  const [EnteredText, setEnteredText] = useState(null);
  const [finalOutput, setFinalOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cryptr = new Cryptr("Skyelint@2020");
  const encryptText = () => {
    setIsLoading(true);
    return new Promise(function (resolve, reject) {
      setTimeout(async () => {
        try {
          if (EnteredText !== null && EnteredText !== "") {
            let tempEncryptValue = await cryptr.encrypt(EnteredText);
            resolve(tempEncryptValue);
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      }, 10);
    });
  };

  const decryptText = () => {
    setIsLoading(true);
    return new Promise(function (resolve, reject) {
      setTimeout(async () => {
        try {
          if (EnteredText !== null && EnteredText !== "") {
            let tempEncryptValue = await cryptr.decrypt(EnteredText);
            resolve(tempEncryptValue);
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      }, 1000);
    });
  };
  return (
    <div>
      <div className="header-self-order">Skyelint Cryptography </div>
      <Row style={{ padding: "10px 10px" }}>
        <Col flex={1}>
          <Input
            placeholder="Enter Text to be encrpyted or decrypted"
            onChange={(e) => {
              setEnteredText(e.target.value);
            }}
            allowClear={true}
          />
        </Col>
      </Row>
      <div style={{ padding: "10px 10px", display: "flex" }}>
        <Button
          disabled={isLoading}
          type="primary"
          style={{ marginRight: 5 }}
          onClick={() =>
            encryptText()
              .then((res) => {
                setFinalOutput(res);
                setIsLoading(false);
              })
              .catch((err) => {
                message.error("Invalid Value", 3);
                setIsLoading(false);
                setFinalOutput(null);
              })
          }
        >
          Encrypt Text
        </Button>
        <Button
          disabled={isLoading}
          type="primary"
          style={{ marginRight: 5 }}
          onClick={() =>
            decryptText()
              .then((res) => {
                setFinalOutput(res);
                setIsLoading(false);
              })
              .catch((err) => {
                message.error("Invalid Value", 3);
                setIsLoading(false);
                setFinalOutput(null);
              })
          }
        >
          Decrypt Text
        </Button>
      </div>
      {isLoading && (
        <div style={{ padding: 10 }}>
          <SyncOutlined spin /> Please Wait a Moment
        </div>
      )}
      <div style={{ padding: "10px 10px" }}>
        <TextArea
          disabled={true}
          //   readOnly={true}
          value={finalOutput}
          placeholder="Your Encrypted Or Decrypted Text Will be shown here"
          rows={6}
          autoSize={true}
        />
        {finalOutput !== "" && finalOutput !== null && (
          <Paragraph
            copyable={{ text: finalOutput }}
            style={{ textAlign: "end", fontWeight: "600", fontSize: 12 }}
          >
            Copy Converted Text
          </Paragraph>
        )}
      </div>
    </div>
  );
};

export default EncrptCustomerSelfOrderForm;
