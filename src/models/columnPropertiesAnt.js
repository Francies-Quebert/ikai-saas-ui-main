class ColumnPropertiesAnt {
  constructor(name, title, filterable, allowSort, width) {
    this.dataIndex = name;
    this.key = name;
    this.title = title;
    this.filtered = filterable;
    if (allowSort === true) {
      this.sorter = (a, b) => a.key - b.key;
    }
    this.width = width;
    // this.align='center'
  }
}

export default ColumnPropertiesAnt;
