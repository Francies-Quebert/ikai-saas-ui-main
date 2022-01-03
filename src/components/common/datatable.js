import React, { Component, Fragment, useEffect } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { green } from "@material-ui/core/colors";
import { Button } from "antd";

export class Datatable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedValues: [],
      myData: this.props.myData,
      selectedRowIndex: null,
    };
  }

  selectRow = (e, i) => {
    if (!e.target.checked) {
      this.setState({
        checkedValues: this.state.checkedValues.filter((item, j) => i !== item),
      });
    } else {
      this.state.checkedValues.push(i);
      this.setState({
        checkedValues: this.state.checkedValues,
      });
    }
  };

  handleRemoveRow = () => {
    const selectedValues = this.state.checkedValues;
    const updatedData = this.state.myData.filter(function (el) {
      return selectedValues.indexOf(el.id) < 0;
    });
    this.setState({
      myData: updatedData,
    });
    toast.success("Successfully Deleted !");
  };

  renderEditable = (cellInfo) => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const data = [...this.state.myData];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ myData: data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.myData[cellInfo.index][cellInfo.column.id],
        }}
      />
    );
  };

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render() {
    const {
      pageSize,
      myClass,
      multiSelectOption,
      pagination,
      filterable,
      showViewDetail, //Hari on 20200222
      allowSingleSelect,
    } = this.props;
    const { myData } = this.state;

    const columns = [];

    if (allowSingleSelect) {
      columns.push({
        Header: <b>{this.Capitalize("Select")}</b>,
        id: "select",
        accessor: (str) => "Select",
        sortable: false,
        style: {
          textAlign: "center",
        },
        minWidth: 50,
        width: 80,
        Cell: (row) => (
          <div>
            <span>
              <label
                className=""
                onClick={(e) => {
                  //  e.target.style.color="red"

                  if (this.state.selectedRowIndex === row.index) {
                    this.setState({ selectedRowIndex: null });
                    this.props.onRowSelectChange(null);
                  } else {
                    this.setState({ selectedRowIndex: row.index });
                    this.props.onRowSelectChange(myData[row.index]);
                  }
                }}
              >
                <i style={{ fontSize: 10 }} className="fa fa-chevron-right"></i>
              </label>
              {/* <input
                type="checkbox"
                name={row.original.id}
                defaultChecked={this.state.selectedRowIndex === row.index}
                value={row.index === this.state.selectedRowIndex}
                onChange={e => {
             
                  if (this.state.selectedRowIndex === row.index) {
              
                    this.setState({ selectedRowIndex: null });
                    this.props.onRowSelectChange(null);
                  } else {                  
                    this.setState({ selectedRowIndex : row.index });
                    this.props.onRowSelectChange(myData[row.index]);
       
                  }
                }}
              /> */}
            </span>
          </div>
        ),
        accessor: key,
        style: {
          textAlign: "center",
        },
      });
    }

    for (var key in myData[0]) {
      let editable = this.renderEditable;
      if (key === "image") {
        editable = null;
      }
      if (key === "status") {
        editable = null;
      }
      if (key === "avtar") {
        editable = null;
      }
      if (key === "vendor") {
        editable = null;
      }
      if (key === "skill") {
        editable = null;
      }
      if (key === "user") {
        editable = null;
      }

      const bb = this.props.columnProperties.filter(
        (item) => key === item.name
      );
      const colProps = bb[0];

      columns.push({
        Header: (
          <b>{this.Capitalize(colProps ? colProps.title : key.toString())}</b>
        ),
        accessor: key,
        filterable:
          this.props.filterable && colProps ? colProps.filterable : false,
        show: colProps ? colProps.visible : true,
        style: {
          textAlign: "center",
        },
        minWidth:
          colProps.minWidth === undefined ? undefined : colProps.minWidth,
        width: colProps.width === undefined ? undefined : colProps.width,
        // isImageUrl: true
      });
    }

    if (multiSelectOption === true && this.props.IsInVisibleAction !== true) {
      columns.push({
        Header: (
          <button
            className="btn btn-danger btn-sm btn-delete mb-0 b-r-4"
            onClick={(e) => {
              if (window.confirm("Are you sure you wish to delete this item?"))
                this.handleRemoveRow();
            }}
          >
            Delete
          </button>
        ),
        id: "delete",
        accessor: (str) => "delete",
        sortable: false,
        style: {
          textAlign: "center",
        },
        Cell: (row) => (
          <div>
            <span>
              <input
                type="checkbox"
                name={row.original.id}
                defaultChecked={this.state.checkedValues.includes(
                  row.original.id
                )}
                onChange={(e) => this.selectRow(e, row.original.id)}
              />
            </span>
          </div>
        ),
        accessor: key,
        style: {
          textAlign: "center",
        },
      });
    } else if (this.props.makeActionInVisible !== true) {
      columns.push({
        Header: <b>Action</b>,
        id: "delete",
        accessor: (str) => "delete",
        width: 100,
        filterable: false,
        Cell: (row) => (
          <div>
            {this.props.AllowDelete === true && (
              <span
                onClick={() => {
                  this.props.onDeletePress(myData[row.index]);
                  // if (
                  //   window.confirm("Are you sure you wish to delete this item?")
                  // ) {
                  //   let data = myData;
                  //   data.splice(row.index, 1);
                  //   this.setState({ myData: data });
                  // }
                  // toast.success("Successfully Deleted !");
                }}
              >
                <i
                  className="fa fa-trash"
                  style={{
                    width: 35,
                    fontSize: 16,
                    padding: 11,
                    color: "#e4566e",
                  }}
                ></i>
              </span>
            )}
            {this.props.AllowViewDetail === true && (
              <a href="#" className="edit-btn">
                <span
                  onClick={() => {
                    this.props.onViewPress(myData[row.index]);
                  }}
                >
                  <i
                    className="fa fa-file"
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "rgb(40, 167, 69)",
                    }}
                  ></i>
                </span>
              </a>
            )}
            {this.props.AllowEdit === true && (
              <a
                href="#"
                className={`edit-btn ${
                  this.props.disableEdit ? `disabled` : ``
                }`}
                disabled={this.props.disableEdit}
              >
                <span
                  onClick={() => {
                    this.props.onEditPress(myData[row.index]);
                  }}
                >
                  <i
                    className="fa fa-pencil"
                    style={{
                      width: 35,
                      fontSize: 16,
                      padding: 11,
                      color: "rgb(40, 167, 69)",
                    }}
                  ></i>
                </span>
              </a>
            )}
          </div>
        ),
        style: {
          textAlign: "center",
        },
        sortable: false,
      });
    }
    function filterCaseInsensitive(filter, row) {
      try {
        const id = filter.pivotId || filter.id;
        return row[id] !== undefined
          ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
          : true;
      } catch {}
    }

    return (
      <Fragment>
        <ReactTable
          data={myData}
          columns={columns}
          defaultPageSize={pageSize}
          className={myClass}
          showPagination={pagination}
          filterable={this.props.filterable}
          // defaultFiltering={["Service Type"]}
          minRows={0}
          defaultFilterMethod={filterCaseInsensitive}
        />
        <ToastContainer />
      </Fragment>
    );
  }
}

export default Datatable;
