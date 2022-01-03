import {
  PlusCircleOutlined,
  UserOutlined,
  MenuOutlined,
  RollbackOutlined,
  // SaveOutlined,
} from "@ant-design/icons";
import { Badge, Button, Card, Col, Row, Table } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardHeader from "../../../common/CardHeader";
import AppLayoutCard from "./AppLayoutCard";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import { setFormCaption } from "../../../../store/actions/currentTran";
import {
  fetchAppLayout,
  fetchAppLayoutDtl,
  InsUpdtAppLayout,
} from "../../../../services/app-layout";
import AppLayoutDtlCard from "./AppLayoutDtlCard";
// import { data } from "autoprefixer";

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: "grab", color: "#999" }} />
));

const AppLayoutTableView = (props) => {
  // console.log(props, "sau");
  const dispatch = useDispatch();

  const [layoutData, setLayoutData] = useState([]);
  const [layoutDtlData, setLayoutDtlData] = useState([]);
  const [editedData, setEditedData] = useState();
  const [editedDtlData, setEditedDtlData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const FileUploadPath = useSelector((state) =>
    state.AppMain.appconfigs.find((aa) => aa.configCode === "UPLOAD_PATH")
  );
  const CompCode = useSelector((state) => state.LoginReducer.CompCode);
  const DeviceType = props.DeviceType;

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchAppLayout(CompCode, DeviceType).then((res) => {
        // console.log(res,"safgh")
        setLayoutData(
          res.map((xx, idx) => {
            return {
              ...xx,
              key: idx,
              IsActive: xx.IsActive.data[0] === 1 ? true : false,
            };
          })
        );
      });
      fetchAppLayoutDtl(CompCode, DeviceType).then((res) => {
        // console.log(res, "safgh");
        setLayoutDtlData(
          res.map((xx, idx) => {
            return {
              ...xx,
              key: idx,
              IsActive: xx.IsActive.data[0] === 1 ? true : false,
            };
          })
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const SortableItem = sortableElement((props) => <tr {...props} />);
  const SortableContainer = sortableContainer((props) => <tbody {...props} />);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const dataSource = layoutData;
    if (oldIndex !== newIndex) {
      // console.log(oldIndex, newIndex, "sau");
      const newData = arrayMoveImmutable(
        [].concat(dataSource),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      const tdata = newData.map((aa, idx) => {
        return {
          ...aa,
          OrderBy: idx + 1,
          CompCode: CompCode,
        };
      });

      setLayoutData([...tdata]);
      // console.log(tdata,"sad")
      InsUpdtAppLayout(tdata);
    }
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ ...restProps } = {}) => {
    const dataSource = layoutData;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.key === restProps["data-row-key"]
    );

    return <SortableItem index={index} {...restProps} />;
  };

  const NestedTable = () => {
    const expandedRowRender = (val, val2, val3) => {
      const columns = [
        {
          key: "key",
          title: "Title",
          dataIndex: "PromoTitle",
          align: "center",
        },
        {
          title: "Promo Image",
          dataIndex: "PromoImageUri",
          key: "PromoImageUri",
          width: 10,
          render: (text, record) => {
            return record.PromoImageUri && record.PromoImageUri.length > 0 ? (
              <Avatar
                shape="square"
                src={
                  record.pathType === "C"
                    ? `${FileUploadPath.value1}/${record.PromoImageUri}`
                    : record.PromoImageUri
                }
              />
            ) : (
              <Avatar shape="square" icon={<UserOutlined />} />
            );
          },
        },
        {
          key: "IsActive",
          title: "Status",
          dataIndex: "IsActive",
          render: (text, record) =>
            record.IsActive === true ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            ),
          align: "center",
        },
        {
          title: "",
          dataIndex: "",
          key: "x",
          render: (text, record) => (
            <a href="#">
              <i
                className="fa fa-pencil-square-o"
                style={{
                  width: 35,
                  fontSize: 16,
                  padding: 11,
                  color: "rgb(40, 167, 69)",
                }}
                onClick={() => {
                  // console.log(record, "sad");
                  setEditedDtlData({
                    entryMode: "E",
                    data: record,
                  });
                }}
              ></i>
            </a>
          ),
        },
      ];

      return (
        <div style={{ margin: 15, marginLeft: 10 }}>
          <Table
            loading={isLoading}
            key="key"
            bordered={false}
            showHeader={false}
            columns={columns}
            dataSource={layoutDtlData.filter(
              (ii) => ii.LayoutId === val.LayoutId
            )}
            pagination={false}
          />
        </div>
      );
    };

    const columns1 = [
      {
        title: "Sort",
        dataIndex: "sort",
        width: 30,
        className: "drag-visible",
        render: () => <DragHandle />,
      },
      {
        title: "",
        dataIndex: "",
        key: "y",
        width: 10,
        render: (text, record) => (
          <a href="#">
            <i
              className="fa fa-plus-circle"
              style={{
                width: 35,
                fontSize: 16,
                padding: 11,
                color: "rgb(24,144,255)",
              }}
              onClick={() => {
                setEditedDtlData({ entryMode: "A", hdrData: record });
              }}
            ></i>
          </a>
        ),
      },
      {
        key: "LayoutId",
        title: "Layout No.",
        dataIndex: "LayoutId",
        align: "center",
      },

      {
        key: "LayoutTitle",
        title: "Layout Title",
        dataIndex: "LayoutTitle",
        align: "center",
      },
      {
        key: "LayoutType",
        title: "Layout Type",
        dataIndex: "LayoutType",
        align: "center",
      },
      {
        key: "OrderBy",
        title: "Order By",
        dataIndex: "OrderBy",
        align: "center",
      },
      {
        key: "IsActive",
        title: "Status",
        dataIndex: "IsActive",
        render: (text, record) =>
          record.IsActive === true ? (
            <Badge status="success" />
          ) : (
            <Badge status="error" />
          ),
        align: "center",
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (text, record) => (
          <a href="#">
            <i
              className="fa fa-pencil-square-o"
              style={{
                width: 35,
                fontSize: 16,
                padding: 11,
                color: "rgb(40, 167, 69)",
              }}
              onClick={() => {
                setEditedData({ entryMode: "E", hdrData: record });
              }}
            ></i>
          </a>
        ),
      },
    ];

    return (
      <Row gutter={[8, 8]}>
        {!editedData && !editedDtlData && (
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <CardHeader title=" App Layout" />
            <Card bodyStyle={{ padding: "10px 10px" }}>
              <Row gutter={[0, 8]}>
                <Col span={24}>
                  <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      setEditedData({ entryMode: "A" });
                    }}
                  >
                    Add New Layout
                  </Button>
                </Col>
                <Col span={24}>
                  {/* {console.log(layoutData, "layoutData")} */}
                  <Table
                    loading={isLoading}
                    expandable={{
                      expandedRowRender,
                    }}
                    pagination={false}
                    dataSource={layoutData.sort((a, b) => {
                      // console.log(a.OrderBy, b.OrderBy);
                      return a.OrderBy < b.OrderBy ? -1 : 1;
                    })}
                    columns={columns1}
                    rowKey="key"
                    components={{
                      body: {
                        wrapper: DraggableContainer,
                        row: DraggableBodyRow,
                      },
                    }}
                  />
                </Col>
                <Col>
                  <Button
                    type="primary"
                    icon={<RollbackOutlined />}
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      props.onBackpress();
                    }}
                  >
                    Back
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
        {editedData &&
          (editedData.entryMode === "E" || editedData.entryMode === "A") && (
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card bodyStyle={{ padding: "10px 10px" }}>
                <AppLayoutCard
                  onBackPress={() => {
                    setEditedData();
                    fetchAppLayout(CompCode, DeviceType).then((res) => {
                      setLayoutData(
                        res.map((xx, idx) => {
                          return {
                            ...xx,
                            key: idx,
                            IsActive: xx.IsActive.data[0] === 1 ? true : false,
                          };
                        })
                      );
                    });
                    setIsLoading(false);
                  }}
                  data={editedData.hdrData}
                  entryMode={editedData.entryMode}
                  DeviceType={props.DeviceType}
                />
              </Card>
            </Col>
          )}
        {editedDtlData &&
          (editedDtlData.entryMode === "E" ||
            editedDtlData.entryMode === "A") && (
            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
              <Card bodyStyle={{ padding: "10px 10px" }}>
                <AppLayoutDtlCard
                  onBackPress={() => {
                    setEditedDtlData();
                    fetchAppLayoutDtl(CompCode, DeviceType).then((res) => {
                      // console.log(res, "fgh");
                      setLayoutDtlData(
                        res.map((xx, idx) => {
                          return {
                            ...xx,
                            key: idx,
                            IsActive: xx.IsActive.data[0] === 1 ? true : false,
                          };
                        })
                      );
                    });
                    setIsLoading(false);
                  }}
                  hdrData={editedDtlData.hdrData}
                  data={editedDtlData.data}
                  DeviceType={props.DeviceType}
                />
              </Card>
            </Col>
          )}
      </Row>
    );
  };
  return <NestedTable />;
};
export default AppLayoutTableView;
