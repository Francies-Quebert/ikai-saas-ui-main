import React, { Fragment, useEffect, useState } from "react";
import Datatable from "./../common/datatable";
import { Button } from "antd";
import { PlusCircleOutlined, FilterOutlined } from "@ant-design/icons";

const CustomDataTable = (props) => {
  const [coloumnData, setColoumnData] = useState([]);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [buttonColor, setbuttonColor] = useState(
    "btn btn-danger p-l-10 p-r-10"
  );

  return (
    <>
      <div className="col-md-12 p-0">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header p-t-10 p-b-10 p-l-5 p-r-5">
            {props.isInvisibleAdd !== true && (
              <Button
              style={{marginRight:10}}
              type="primary"
                name="add"
                onClick={props.onAddClick}
                icon={<PlusCircleOutlined />}
                disabled={props.addDisabled}
              >
                {/* <i className="icon-plus p-t-5"></i> */}
                 Add
              </Button>
            )}
            {props.isInvisibleFilter !== true && (
              <Button
                // type="dashed"
                name="filter"
                // className={buttonColor}
                onClick={(e) => {
                  setToggleFilter(!toggleFilter);
                  // setbuttonColor(
                  //   buttonColor === "btn btn-danger p-l-10 p-r-10"
                  //     ? "btn btn-success p-l-10 p-r-10"
                  //     : "btn btn-danger p-l-10 p-r-10"
                  // );
                  
                }}
                icon={<FilterOutlined />}
                danger={!toggleFilter}
              >
                {/* <i className="icon-filter" style={{ paddingTop: 5 }}></i>  */}
                Filter
              </Button>
            )}
          </div>
          {props.myData.length > 0 && (
            <div className="card-body p-t-5 p-b-5 p-l-5 p-r-5 datatable-react">
              <Datatable
                // multiSelectOption={myData}
                columnProperties={props.columnProperties}
                myData={props.myData}
                pageSize={
                  props.pageDefaultSize === undefined
                    ? 50
                    : props.pageDefaultSize
                }
                pagination={
                  props.showPagination === undefined
                    ? true
                    : props.showPagination
                }
                class="-striped -highlight"
                AllowEdit={props.AllowEdit===undefined ? true :props.AllowEdit}
                AllowViewDetail={props.AllowViewDetail}
                AllowDelete={props.AllowDelete}
                filterable={toggleFilter}
                columns={coloumnData}
                onEditPress={props.onEditPress}
                onViewPress={props.onViewPress}
                onDeletePress={props.onDeletePress}
                //Added by Hari on 20200222
                makeActionInVisible={props.makeActionInVisible}
                onRowSelectChange={props.onRowSelectChange}
                // onRowDeSelect={props.onRowDeSelect}
                showViewDetail={props.showViewDetail}
                allowSingleSelect={props.allowSingleSelect}
                disableEdit={props.disableEdit}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomDataTable;
