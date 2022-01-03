import React from "react";
import { Card, Row, Col } from "antd";
import ViewDtlComponent from "./ViewDtlComponent";

const KotViewComponent = (props) => {
  return (
    <></>
    // <>
    //   <div
    //     className="view-pos"
    //     style={{
    //       display: "flex",
    //       marginBottom: 10,
    //       border: `6px solid ${
    //         props.color.find((i) => i.ShortCode === props.group).SysOption1
    //       }`,
    //       borderLeftWidth: 0,
    //       height: "40%",
    //     }}
    //   >
    //     <Card
    //       style={{ flex: "0 1 15px", marginRight: 7, borderWidth: 0 }}
    //       bodyStyle={{
    //         height: "100%",
    //         display: "flex",
    //         alignItems: "center",
    //         fontFamily: `Cairo, sans-serif`,
    //         color: ` ${
    //           props.color.find((i) => i.ShortCode === props.group).SysOption2
    //         }`,
    //         background: ` ${
    //           props.color.find((i) => i.ShortCode === props.group).SysOption1
    //         }`,
    //         padding: 12,
    //       }}
    //     >
    //       <strong>
    //         {props.group === "PND"
    //           ? "P E N D I N G"
    //           : props.group === "PPND"
    //           ? "P A R T I A L R E A D Y"
    //           : props.group === "RDY"
    //           ? "R E A D Y"
    //           : props.group === "CMP"
    //           ? "C O M P L E T E D"
    //           : ""}
    //       </strong>
    //     </Card>
    //     <Row
    //       className="style-2"
    //       style={{
    //         flex: 1,
    //         overflowX: "auto",
    //         flexWrap: "nowrap",
    //         paddingBottom: 7,
    //         margin: "6px 0px 0px",
    //       }}
    //       gutter={[8, 8]}
    //     >
    //       {props.data.length > 0 &&
    //         props.data.map((data) => {
    //           return (
    //             <Col xs={24} sm={12} md={8} lg={8} xl={6} key={data.KOTId}>
    //               <ViewDtlComponent data={data} kotId={data.KOTId} />
    //             </Col>
    //           );
    //         })}
    //     </Row>
    //   </div>
    // </>
  );
};

export default KotViewComponent;
