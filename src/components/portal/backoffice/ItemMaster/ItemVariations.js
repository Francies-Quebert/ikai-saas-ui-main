// BelowRequired
import {
  Checkbox,
  Button,
  Modal,
  Input,
  Select,
  Divider,
  Table,
  InputNumber,
  notification,
} from "antd";
import React, { useState, useEffect } from "react";
import _, { values } from "lodash";
import {
  DeleteOutlined,
  FileDoneOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { variationDetailContext } from "./ItemMasterCardNew";
import {
  fetchDataItemVariants,
  fetchItemImages,
} from "../../../../services/item-master";
import EditItemVariations from "./EditItemVariations";
import { useSelector } from "react-redux";
const { Option } = Select;
// var { variationDataSource, setVariationDataSource } = React.useContext(
//   variationDetailContext
// );
const OptionInputs = ({
  options,
  multiSelect,
  showRemove,
  handleRemoveClick,
  OptionType,
}) => {
  return options && multiSelect ? (
    <div className="pt-1">
      <div className="leading-loose flex justify-between">
        <div className="font-semibold">
          Option {options.OptionNumber || "1"}
        </div>
        {showRemove && (
          <div
            className="font-normal text-primary-color underline cursor-pointer"
            onClick={handleRemoveClick}
          >
            Remove
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="">
          <Select
            placeholder={options.OptionPlaceholder || "Please Select"}
            defaultValue={
              options.OptionDefaultValue ? options.OptionDefaultValue : null
            }
            value={options.OptionValue || []}
            onChange={(value, option) => {
              if (options.handleOptionNameInput) {
                options.handleOptionNameInput(value, option);
              }
            }}
            className="w-full"
            // allowClear="true"
            // onClear={(value, option) => {
            //   if (options.handleAllClear) {
            //     options.handleAllClear(value, option);
            //   }
            // }}
          >
            {OptionType.map((val) => {
              return (
                <Option key={val.ValueMember} value={val.ValueMember}>
                  {val.DisplayMember}
                </Option>
              );
            })}
          </Select>
        </div>
        <div className="w-full col-span-2">
          <Select
            mode="tags"
            placeholder={multiSelect.multiSelectPlaceholder || "Please Select"}
            defaultValue={multiSelect.multiSelectDefaultValue || []}
            value={multiSelect.multiSelectValue || []}
            onChange={(value, option) => {
              if (multiSelect.handleOptionMultiSelectInput) {
                multiSelect.handleOptionMultiSelectInput(value, option);
              }
            }}
            onInputKeyDown={(e) => {
              if (e.code === "Tab") {
              }
            }}
            optionFilterProp="label"
            className="w-full"
          ></Select>
        </div>
      </div>
    </div>
  ) : null;
};

const ItemVariations = (props) => {
  var {
    variationDataSource,
    setVariationDataSource,
    variantTypes,
    itemData,
    CompCode,
    uploadedImg,
    setUploadedImg,
    fetchImageUpload,
    setFetchImageUpload,
  } = React.useContext(variationDetailContext);
  const [allowVariants, setAllowVariants] = useState(
    props.Entrymode === "A" ? false : true
  );
  const [addVariants, setAddVariants] = useState(false);
  const [Options, setOptions] = useState([
    { optionName: null, values: [], key: 1 },
  ]);
  const [detailDatasource, setDetailDatasource] = useState([]);
  const [editVariants, setEditVariants] = useState(false);
  const FileUploadPath = useSelector((state) => state.AppMain.appconfigs).find(
    (aa) => aa.configCode === "UPLOAD_PATH"
  );

  useEffect(() => {
    initialLoadEdit();
    return () => {};
  }, [variantTypes]);

  const initialLoadEdit = async () => {
    if (itemData && itemData.ItemCode && variantTypes.length > 0) {
      let varData = await fetchDataItemVariants(CompCode, itemData.ItemCode);
      let tempDataSource = [];
      let tempDetailData = [];
      let temp = [];
      varData.map((aa, index) => {
        let cvar = [aa.Var1, aa.Var2, aa.Var3, aa.Var4, aa.Var5];
        let TvarType = cvar.map((tvr, i) => {
          let tname = variantTypes.find(
            (aa) => aa.ValueMember === `Var${i + 1}`
          );
          return {
            tag: tvr,
            name: tname ? tname.ValueMember : null,
            type: tname ? tname.DisplayMember : null,
          };
        });
        // if (aa.IsActive.data[0] === 1) {
        tempDetailData.push(TvarType.filter((vr) => vr.tag !== null));
        // }

        tempDataSource.push({
          variants: cvar.filter((vr) => vr !== null),
          price: aa.SalePrice,
          qty: null,
          sku: aa.ItemCode,
          barcode: aa.Barcode,
          isDeleted: aa.IsActive.data[0] ? false : true,
          variantType: TvarType.filter((vr) => vr.tag !== null),
          isEditable: false,
          varData: aa,
          costPrice: aa.Cost,
          MRP: aa.MRP,
          IsActive: aa.IsActive.data[0] === 1 ? true : false,
          key: tempDataSource.length + 1,
          initialBarcode: aa.Barcode,
        });
        fetchItemImages(CompCode, aa.ItemCode).then((res) => {
          res.map((ii) => {
            temp.push({
              uid: ii.uid ? ii.uid : temp.length + 1,
              name: ii.ImageName,
              status: "done",
              url:
                ii.pathType === "C"
                  ? `${FileUploadPath.value1}/${ii.URL}`
                  : ii.URL,
              isDirty: false,
              pathType: ii.pathType,
              isDeleted: false,
              ItemCode: aa.ItemCode,
            });
          });
        });
      });
      setFetchImageUpload({ ...fetchImageUpload, fileList: temp });
      setUploadedImg(temp);
      setVariationDataSource([...tempDataSource]);
      setDetailDatasource([...tempDetailData]);
      return varData;
    }
  };

  const showModal = () => {
    setAddVariants(true);
  };
  const handleOk = () => {
    setAddVariants(false);
  };

  const handleCancel = () => {
    setAddVariants(false);
  };

  const handleAllClear = (val, op) => {
    const index = Options.findIndex((aa) => aa.key === op.key);
    let tempData = Options;
    tempData[index].optionName = null;
    return setOptions([...tempData]);
  };

  const handleSKUData = async (data) => {
    // actually working
    let initialData = data ? data : Options;
    let tempData = initialData
      .filter((aa) => !_.includes([null, undefined, ""], aa.optionName))
      .map((aa) => {
        return aa.values;
      })
      .filter((bb) => bb !== null && bb.length > 0);
    let tempDetailedData = initialData
      .filter((aa) => !_.includes([null, undefined, ""], aa.optionName))
      .map((aa) => {
        return aa.values
          ? aa.values.map((bb) => {
              let tname = variantTypes.find(
                (d) => d.ValueMember === aa.optionName
              );
              return {
                tag: bb,
                name: aa.optionName,
                type: tname ? tname.DisplayMember : null,
              };
            })
          : true;
      })
      .filter((bb) => bb !== null && bb.length > 0);

    const cartesian = (...a) =>
      a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

    let dataSource = [];
    if (tempData.length > 0) {
      let output = cartesian(...tempData);
      let detailedOutput = cartesian(...tempDetailedData);

      dataSource = output.map((data, index) => {
        return {
          variants: _.isArray(data) ? data : [data],
          price:
            props.Entrymode === "A" && itemData && itemData.SalePrice
              ? itemData.SalePrice
              : null,
          qty: null,
          sku: null,
          barcode: null,
          key: index + 1,
          isDeleted: false,
          variantType: _.isArray(detailedOutput[index])
            ? detailedOutput[index]
            : [detailedOutput[index]],
          isEditable: false,
          costPrice: null,
          MRP: null,
          IsActive: true,
          initialBarcode: null,
        };
      });
      setDetailDatasource([...detailedOutput]);
    }
    console.log(dataSource, "dataSource");
    setVariationDataSource([...dataSource]);
  };

  const handleRemoveClick = (op) => {
    let tempData = Options.filter((aa) => aa.key !== op.key).map((bb, i) => {
      return { ...bb, key: i + 1 };
    });

    const data = [...tempData];
    setOptions(data);
    handleSKUData(data);
  };

  const handleOptionNameInput = (val, op) => {
    const index = Options.findIndex((aa) => aa.key === op.key);
    let tempData = Options;
    tempData[index].optionName = val;
    const data = val ? [...tempData] : [...Option];
    setOptions(data);
    handleSKUData(data);
  };

  const handleOptionMultiSelectInput = (ms, op) => {
    const index = Options.findIndex((aa) => aa.key === op.key);
    let tempData = Options;
    tempData[index].values = ms;
    let data = ms ? [...tempData] : Options;

    setOptions(data);
    handleSKUData(data);
  };

  const renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    if (row.isDeleted) {
      obj.props.colSpan = 0;
    }
    return obj;
  };

  return (
    <div className="p-4">
      {/* -------------------------------------------------------------Initial Screen------------------------------------------------------------------- */}
      <div className={`${props.Entrymode === "A" ? "" : "hidden"}`}>
        <Checkbox
          onChange={(e) => {
            setAllowVariants(e.target.checked);
          }}
        >
          This product has multiple options, like different sizes or colors
        </Checkbox>
      </div>
      <div className="py-2">
        <Button
          disabled={!allowVariants}
          className="w-full"
          type="primary"
          onClick={showModal}
        >
          {variationDataSource.length > 0 ? `Edit Variants` : `Add Variants`}
        </Button>
      </div>

      {/* 2 ---------------------------------------------------------Modal For variation Add here----------------------------------------------------------------- */}
      <Modal
        visible={addVariants}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        wrapClassName="p-0"
        bodyStyle={{ padding: 0 }}
        closable={false}
        className="w-full"
        closeIcon={null}
        centered={true}
        // destroyOnClose={props.Entrymode === "A" ? false : true}
      >
        {(props.Entrymode === "A" || variationDataSource.length <= 0) && (
          <>
            <div className="p-4 py-2 ">
              <h1 className="text-lg text-primary-color font-semibold">
                Options
              </h1>
            </div>
            <Divider className="mt-1 mb-0" />
            {/* 3 -------------------------------------------------------User ADD Variations------------------------------------------------------- */}
            <div className="p-4 pt-0">
              {Options &&
                Options.map((op) => {
                  const SelectedOption = Options.filter(
                    (so) => !_.includes([null, "", undefined], so.optionName)
                  )
                    .map((aa) => aa.optionName)
                    .filter((aa) => aa !== op.optionName);

                  return (
                    <OptionInputs
                      OptionType={variantTypes.filter(
                        (aa) => !_.includes(SelectedOption, aa.ValueMember)
                      )}
                      showRemove={variantTypes.length > 1}
                      key={op.key}
                      handleRemoveClick={() => {
                        handleRemoveClick(op);
                      }}
                      options={{
                        OptionNumber: op.key,
                        OptionPlaceholder: "Select Variant",
                        OptionDefaultValue: op.optionName,
                        OptionValue: op.optionName,
                        handleOptionNameInput: (val) => {
                          handleOptionNameInput(val, op);
                        },
                        handleAllClear: (val) => {
                          handleAllClear(val, op);
                        },
                      }}
                      multiSelect={{
                        multiSelectPlaceholder: "Please Enter Variants",
                        multiSelectDefaultValue: op.values,
                        multiSelectValue: op.values,
                        handleOptionMultiSelectInput: (ms) => {
                          handleOptionMultiSelectInput(ms, op);
                        },
                      }}
                    />
                  );
                })}
            </div>
            <Divider className="mt-0 mb-0" />
            <div className="p-4">
              <Button
                className="w-full text-primary-color border-primary-color"
                type="dashed"
                onClick={() => {
                  setOptions([
                    ...Options,
                    { optionName: null, values: [], key: Options.length + 1 },
                  ]);
                }}
                disabled={Options.length === variantTypes.length}
              >
                Add Another Options
              </Button>
            </div>
            <Divider className="mt-0 mb-0" />
          </>
        )}
        {/* 4 -------------------------------------------------------User Preview Variations------------------------------------------------------- */}

        <Table
          className="px-4 py-3"
          bordered={true}
          dataSource={variationDataSource.filter((aa) => aa.IsActive === true)}
          size={"small"}
          pagination={false}
          scroll={{ x: "max-content", y: 450 }}
          columns={[
            {
              title: "Variants",
              dataIndex: "variants",
              key: "key",
              render: (data, record, idx) => {
                let value;
                if (!record.isEditable) {
                  if (typeof data === "string") {
                    value = data;
                  } else {
                    value = data.map((aa, i) =>
                      i !== 0 ? `/ ${aa} ` : `${aa} `
                    );
                  }
                  value = <div className="font-semibold">{value}</div>;
                } else {
                  value = (
                    <AddNewVariantComponent
                      record={record}
                      dataSource={variationDataSource}
                      dataSourceIdx={idx}
                      onDataChange={(data) => {
                        setVariationDataSource([...data]);
                      }}
                    />
                  );
                }
                const obj = {
                  children: value,
                  props: {
                    colSpan: 1,
                  },
                };
                return obj;
              },
            },
            {
              title: "Price",
              width: 150,
              dataIndex: "price",
              render: (value, record) => {
                const Index = variationDataSource.findIndex(
                  (aa) => aa.key === record.key
                );
                return renderContent(
                  <InputNumber
                    className="w-full"
                    step="0.01"
                    stringMode
                    placeholder="Enter Price"
                    value={variationDataSource[Index].price}
                    onChange={(e) => {
                      variationDataSource[Index].price = e;
                      setVariationDataSource([...variationDataSource]);
                    }}
                  />,
                  record,
                  Index
                );
              },
            },
            // {
            //   title: "Quantity",
            //   dataIndex: "qty",
            //   width: 150,
            //   render: (value, record, index) => {
            //     return renderContent(
            //       <InputNumber
            //         className="w-full"
            //         step="0.01"
            //         stringMode
            //         placeholder="Enter Quantity"
            //         onChange={(e) => {
            //           variationDataSource[index].qty = e;
            //         }}
            //       />,
            //       record,
            //       index
            //     );
            //   },
            // },
            {
              title: "SKU",
              dataIndex: "sku",
              width: 150,
              render: (value, record, index) => {
                return renderContent(
                  <Input
                    className="w-full"
                    placeholder="SKU"
                    readOnly={true}
                    value={value}
                  />,
                  record,
                  index
                );
              },
            },
            {
              title: "Barcode",
              dataIndex: "barcode",
              width: 150,
              render: (value, row, index) => {
                const Index = variationDataSource.findIndex(
                  (aa) => aa.key === row.key
                );
                return renderContent(
                  <Input
                    disabled={itemData && itemData.MainItemCode ? true : false}
                    className="w-full"
                    placeholder="Enter barcode"
                    onChange={(e) => {
                      variationDataSource[Index].barcode = e.target.value;
                    }}
                    defaultValue={value}
                  />,
                  row,
                  index
                );
              },
            },
            {
              title: "Action",
              dataIndex: "x",
              width: 60,
              size: "small",
              align: "center",
              render: (value, record, index) => {
                const deleteUndoVariant = (type) => {
                  const Index = variationDataSource.findIndex(
                    (aa) => aa.key === record.key
                  );
                  let tempDataSrc = variationDataSource;
                  tempDataSrc[Index].isDeleted = type === "U" ? false : true;
                  setVariationDataSource([...tempDataSrc]);
                };
                const obj = {
                  children: record.isDeleted ? (
                    <div className="text-gray-500 text-normal">
                      This variant is deleted
                      <a
                        className="underline text-blue-600 pl-1 text-xs font-semibold"
                        onClick={() => {
                          deleteUndoVariant("U");
                        }}
                      >
                        UNDO
                      </a>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      {record.isEditable && (
                        <Button
                          className="w-3/6"
                          icon={<FileDoneOutlined />}
                          onClick={async (e) => {
                            let tmpVariationDataSource = variationDataSource;
                            let tmpDetailDatasource = detailDatasource;
                            let tempIdx = variationDataSource.findIndex(
                              (bb) => bb.key === record.key
                            );
                            let tempTag = variationDataSource[
                              tempIdx
                            ].variantType.map((aa) =>
                              _.includes([null, "", undefined], aa.tag)
                            );

                            let vData = variationDataSource
                              .filter(
                                (bb) =>
                                  bb.isEditable === false &&
                                  bb.IsActive === true
                              )
                              .map((aa) =>
                                aa.variants.reduce((prev, curvalue) => {
                                  if (prev.length > 0) {
                                    return [...prev, curvalue];
                                  } else {
                                    return [curvalue];
                                  }
                                }, [])
                              );

                            let dData =
                              tmpVariationDataSource[tempIdx].variants;
                            let a = JSON.stringify(vData);
                            let b = JSON.stringify(dData);
                            var c = a.indexOf(b);
                            // console.log(c,tmpVariationDataSource[c],"tmpVariationDataSource[c]")
                            if (_.includes(tempTag, true)) {
                              notification.error({
                                message: "Invalid Variation",
                                description:
                                  "The variation your trying to save is empty",
                              });
                              return false;
                            } else {
                              if (c < 0) {
                                let tmpdetailDatasource = detailDatasource;
                                tmpdetailDatasource.push(
                                  variationDataSource[tempIdx].variantType
                                );
                                variationDataSource[tempIdx].isEditable = false;
                                setVariationDataSource([
                                  ...variationDataSource,
                                ]);
                              } else {
                                notification.error({
                                  message: "Invalid Variation",
                                  description:
                                    "The variation your trying to save already exist or is empty",
                                });
                              }
                            }
                          }}
                        />
                      )}
                      {!record.isEditable && props.Entrymode === "E" && (
                        <Button
                          className="mr-1 flex justify-center font-semibold"
                          onClick={() => {
                            setAddVariants(false);
                            setEditVariants(record);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        className="w-3/6 px-1"
                        disabled={record.isEditable}
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          deleteUndoVariant("D");
                        }}
                      />
                    </div>
                  ),
                  props: { colSpan: record.isDeleted ? 5 : 1 },
                };
                return obj;
              },
            },
          ]}
        />
        {/* 5 ----------------------------------------------------Add New variants incase of Edit-------------------------------------------------------------- */}
        {props.Entrymode === "E" && variationDataSource.length > 0 && (
          <>
            <div className="px-4">
              <Button
                className="w-full text-primary-color border-primary-color font-semibold"
                type="dashed"
                onClick={() => {
                  let tmpDataSource = variationDataSource;
                  if (tmpDataSource.length > 0) {
                    let tempVari = tmpDataSource[0].variantType;
                    let variation = [];
                    const VariType = tempVari.map((aa, idx) => {
                      variation[idx] = null;
                      return { tag: null, name: aa.name };
                    });
                    tmpDataSource.push({
                      variants: variation,
                      price: null,
                      qty: null,
                      sku: null,
                      key: tmpDataSource.length + 1,
                      isDeleted: false,
                      variantType: VariType,
                      isEditable: true,
                      IsActive: true,
                      initialBarcode: null,
                      barcode: null,
                    });
                    setVariationDataSource([...tmpDataSource]);
                  }
                }}
                disabled={
                  variationDataSource.filter((ee) => ee.isEditable === true)
                    .length > 0
                }
              >
                Add New Variations
              </Button>
            </div>
            <Divider className="mt-1 mb-0" />
          </>
        )}
        <div className="flex justify-end p-4">
          {/* <Button className="mr-1" onClick={() => setAddVariants(false)}>
            Back
          </Button> */}

          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            disabled={
              variationDataSource.filter((aa) => aa.isEditable === true)
                .length > 0
            }
            onClick={() => {
              setVariationDataSource([...variationDataSource]);
              setAddVariants(false);
            }}
          >
            Save &amp; Close
          </Button>
        </div>
      </Modal>
      <Modal
        visible={editVariants ? true : false}
        // onOk={()=>{}}
        onCancel={() => setEditVariants(false)}
        footer={null}
        wrapClassName="p-0"
        bodyStyle={{ padding: 0 }}
        closable={false}
        className="w-full"
        closeIcon={null}
        centered={true}
        // destroyOnClose={true}
      >
        <EditItemVariations
          record={editVariants}
          dataSource={variationDataSource}
          onCloseClick={() => {
            setEditVariants(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default ItemVariations;

export const AddNewVariantComponent = ({
  record,
  dataSource: data,
  dataSourceIdx,
  onDataChange,
}) => {
  var { variantTypes } = React.useContext(variationDetailContext);
  return (
    <div className="flex overflow-auto">
      {record.variantType
        ? record.variantType.map((aa, idx) => {
            let Name = variantTypes.find((bb) => bb.ValueMember === aa.name);
            let tempDataIdx = data.findIndex((bb) => bb.key === record.key);
            let tempData = data;
            return (
              <div className="pr-1 flex-1" key={aa.name}>
                <div className="font-semibold text-primary-color">
                  {_.upperFirst(Name.DisplayMember)}
                </div>
                <div>
                  <Input
                    className="w-full"
                    size="small"
                    // value={tempData[tempDataIdx].variants[idx]}
                    onChange={(e) => {
                      tempData[tempDataIdx].variants[idx] = e.target.value;
                      tempData[tempDataIdx].variantType[idx] = {
                        ...tempData[tempDataIdx].variantType[idx],
                        tag: e.target.value,
                      };
                      // console.log(tempData, record, "tempData in change");
                      onDataChange(tempData);
                    }}
                  />
                </div>
              </div>
            );
          })
        : "No Variants Exist"}
    </div>
  );
};
