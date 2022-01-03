import React from "react";
import { Table, Switch, Radio, Form } from "antd";


const expandable = {
  expandedRowRender: (record) => <p>{record.description}</p>,
};
const showHeader = true;
const footer = () => "Here is footer";
const pagination = { position: "bottom" };

class AntDataTable extends React.Component {
  state = {
    bordered: this.props.bordered ? this.props.bordered : false,
    loading: this.props.loading ? this.props.loading : false,
    pagination: this.props.pagination ? this.props.pagination : this.props.pagination===false ? false: pagination,
    size: this.props.size ? this.props.size : "small",
    expandable : this.props.expandable ? this.props.expandable : null ,
    title: undefined,
    showHeader: this.props.showHeader ? this.props.showHeader : showHeader,
    footer: this.props.footer,
    rowSelection: null,
    scroll: undefined,
    hasData: this.props.data && this.props.data.length > 0 ? true : false,
    tableLayout: undefined,
    align: this.props.align ? this.props.align : "left",
    loading:this.props.loading ? this.props.loading : false
  };

  render() {
    const { xScroll, yScroll, ...state } = this.state;

    const scroll = {};
    if (yScroll) {
      scroll.y = 240;
    }
    if (xScroll) {
      scroll.x = "100vw";
    }

    const tableColumns = this.props.columns && this.props.columns.map((item) => ({
      ...item,
      ellipsis: state.ellipsis,
    }));
    if (xScroll === "fixed") {
      tableColumns[0].fixed = true;
      tableColumns[tableColumns.length - 1].fixed = "right";
    }
    return (
      <Table
        {...this.state}
        size="small"
        rowClassName={(record, index) => index % 2 === 1 ? 'table-back-color' : '' }
        columns={tableColumns}
        dataSource={state.hasData ? this.props.data : null}
        scroll={scroll}
      />
    );
  }
}

export default AntDataTable;
