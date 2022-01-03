import axios from "../axios";

export const fetchReportMaster = (CompCode, pReportId) => {
  return new Promise(async function (resolve, reject) {
    try {
      await axios
        .get(`report-master/getReportDetails/${CompCode}/${pReportId}`)
        .then(async (res) => {
          let reportMaster = {
            reportMasterHdr: [],
            reportMasterCol: [],
            reportMasterParam: [],
            reportChartHdr: [],
            reportChartDtl: [],
            reportPrintHdr: [],
          };
          const resDataHdr = res.data.data[0];

          for (const key in resDataHdr) {
            await reportMaster.reportMasterHdr.push({
              ReportId: resDataHdr[key].ReportId,
              ProjectType: resDataHdr[key].ProjectType,
              ReportName: resDataHdr[key].ReportName,
              ReportDesc: resDataHdr[key].ReportDesc,
              ReportVariation: resDataHdr[key].ReportVariation,
              ReportSource: resDataHdr[key].ReportSource,
              hasView: resDataHdr[key].hasView,
              hasPrintable: resDataHdr[key].hasPrintable,
              hasGraph: resDataHdr[key].hasGraph,
              IsActive: resDataHdr[key].IsActive,
              ReportGroup: resDataHdr[key].ReportGroup,
            });

            //     resolve(orderAddOnCost);
          }

          const resDataCol = res.data.data[1];

          for (const key in resDataCol) {
            await reportMaster.reportMasterCol.push({
              Id: resDataCol[key].Id,
              ReportId: resDataCol[key].ReportId,
              ColumnName: resDataCol[key].ColumnName,
              ColumnTitle: resDataCol[key].ColumnTitle,
              ColumnWidth: resDataCol[key].ColumnWidth,
              ColumnDataType: resDataCol[key].ColumnDataType,
              ColumnPosition: resDataCol[key].ColumnPosition,
              ColumnFixed: resDataCol[key].ColumnFixed,
              ColumnAllowFilter: resDataCol[key].ColumnAllowFilter,
              ColumnAlign: resDataCol[key].ColumnAlign,
              ColumnShowToolTip: resDataCol[key].ColumnShowToolTip,
              ColumnParentName: resDataCol[key].ColumnParentName,
              ColumnShowSummary: resDataCol[key].ColumnShowSummary,
              ColumnSummaryType: resDataCol[key].ColumnSummaryType,
            });
          }

          const resDataParam = res.data.data[2];

          for (const key in resDataParam) {
            await reportMaster.reportMasterParam.push({
              Id: resDataParam[key].Id,
              ReportId: resDataParam[key].ReportId,
              ParamDataSourcePosition:
                resDataParam[key].ParamDataSourcePosition,
              ParamName: resDataParam[key].ParamName,
              ParamDesc: resDataParam[key].ParamDesc,
              ParamType: resDataParam[key].ParamType,
              ParamDefValue: resDataParam[key].ParamDefValue,
              ParamPosition: resDataParam[key].ParamPosition,
              ParamIsVisible: resDataParam[key].ParamIsVisible,
              ParamDataSource: resDataParam[key].ParamDataSource,
              ParamIsCompulsary: resDataParam[key].ParamIsCompulsary,
              ParamPlaceHolder: resDataParam[key].ParamPlaceHolder,
              ParamNewLineAfter: resDataParam[key].ParamNewLineAfter,
              dataSource: [],
            });
          }

          const resDataChartHdr = res.data.data[3];

          for (const key in resDataChartHdr) {
            await reportMaster.reportChartHdr.push({
              ChartId: resDataChartHdr[key].ChartId,
              ReportId: resDataChartHdr[key].ReportId,
              ChartSource: resDataChartHdr[key].ChartSource,
              ChartType: resDataChartHdr[key].ChartType,
              ChartTitle: resDataChartHdr[key].ChartTitle,
              ChartHeight: resDataChartHdr[key].ChartHeight,
              ChartWidth: resDataChartHdr[key].ChartWidth,
              ChartOption1: resDataChartHdr[key].ChartOption1,
              ChartOption2: resDataChartHdr[key].ChartOption2,
              ChartOption3: resDataChartHdr[key].ChartOption3,
              ChartOption4: resDataChartHdr[key].ChartOption4,
              ChartOption5: resDataChartHdr[key].ChartOption5,
              ChartOption6: resDataChartHdr[key].ChartOption6,
              ChartOption7: resDataChartHdr[key].ChartOption7,
              ChartOption8: resDataChartHdr[key].ChartOption8,
              ChartOption9: resDataChartHdr[key].ChartOption9,
              ChartOption10: resDataChartHdr[key].ChartOption10,
            });
          }

          const resDataChartDtl = res.data.data[4];

          for (const key in resDataChartDtl) {
            await reportMaster.reportChartDtl.push({
              Id: resDataChartDtl[key].Id,
              ChartId: resDataChartDtl[key].ChartId,
              ReportId: resDataChartDtl[key].ReportId,
              ColumnName: resDataChartDtl[key].ColumnName,
              ColumnTitle: resDataChartDtl[key].ColumnTitle,
              ColumnDataType: resDataChartDtl[key].ColumnDataType,
              ColumnPosition: resDataChartDtl[key].ColumnPosition,
            });
          }

          // console.log("here");
          resolve(await reportMaster);
          // return reportMaster;
        })
        .catch((err) => {
          console.error("rejected from fetchReportMaster", err);
          reject(err);
        });
    } catch (e) {
      console.error("rejected from fetchReportMaster", e);
      reject(e);
    }
  });
};

export function getReportDetailsData(CompCode, pQuery, pParameter) {
  return new Promise(function (resolve, reject) {
    try {
      // console.log(CompCode, pQuery, pParameter);
      const data = { query: pQuery, parameter: pParameter, CompCode: CompCode };
      axios
        .post(`report-master/getReportDetailsData`, { data })
        .then((res) => {
          const resData = res.data.data;
          const finalData = [];
          resData.forEach((element, index) => {
            finalData.push({ key: index, ...element });
          });
          resolve(finalData);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchParamSelectQuery(pQuery) {
  return new Promise(async function (resolve, reject) {
    try {
      // const data = { query: pQuery, parameter: pParameter };
      let data;
      await axios
        .get(`report-master/getParamSelectQuery/${pQuery}`)
        .then((res) => {
          const resData = res.data.data;
          data = resData;
        })
        .catch((err) => {
          console.error(err, "error in Details Data");
          reject(err);
        });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}
export function getResponseData(CompCode, reportId) {
  Promise.all([fetchReportMaster(CompCode, reportId)]).then((values) => {});
}

export function getReportHdrDetails(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`report-master/getReportHdrDtl/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;
          const finalData = [];
          resData.forEach((element, index) => {
            finalData.push({ key: index, ...element });
          });
          resolve(finalData);
        })
        .catch((err) => {
          console.error(err, "error in Details Data");
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchSysReportPrintHdr(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`report-master/getSysReportPrintHdr/${CompCode}`)
        .then((res) => {
          // console.error(res.data.data,'respose from something')
          const resData = res.data.data;
          let finalData = [];
          resData &&
            resData.forEach((element, index) => {
              finalData.push({ key: index, ...element });
            });
          resolve(finalData);
        })
        .catch((err) => {
          console.error(err, "error in Details Data");
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function fetchSysReportChartHdr(CompCode) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .get(`report-master/getSysReportChartHdr/${CompCode}`)
        .then((res) => {
          const resData = res.data.data;
          const finalData = [];
          resData.forEach((element, index) => {
            finalData.push({ key: index, ...element });
          });
          resolve(finalData);
        })
        .catch((err) => {
          console.error(err, "error in Details Data");
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function updtSystemReportConfigs(CompCode, data) {
  return new Promise(function (resolve, reject) {
    try {
      axios
        .post(`report-master/updtSystemReportConfigs`, {
          data: { ...data, CompCode: CompCode },
        })
        .then((res) => {
          const resData = res.data;
          // const finalData = [];
          // resData.forEach((element, index) => {
          //   finalData.push({ key: index, ...element });
          // });
          resolve(resData);
        })
        .catch((err) => {
          console.error(err, "error in Details Data");
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export const fetchReportMasterNew = (CompCode, pReportId) => {
  return new Promise(async function (resolve, reject) {
    try {
      let reportMaster;
      await axios
        .get(`report-master/getReportDetails/${CompCode}/${pReportId}`)
        .then(async (res) => {
          reportMaster = {
            reportMasterHdr: res.data.data[0],
            reportMasterCol: res.data.data[1],
            reportMasterParam: res.data.data[2],
            reportChartHdr: res.data.data[3],
            reportChartDtl: res.data.data[4],
            reportPrintHdr: res.data.data[5],
          };
          // const resDataHdr = res.data.data[0];

          // for (const key in resDataHdr) {
          //   // console.log(resDataHdr[key], "repor hdr  fetching");
          //   reportMaster.reportMasterHdr.push({
          //     ReportId: resDataHdr[key].ReportId,
          //     ProjectType: resDataHdr[key].ProjectType,
          //     ReportName: resDataHdr[key].ReportName,
          //     ReportDesc: resDataHdr[key].ReportDesc,
          //     ReportVariation: resDataHdr[key].ReportVariation,
          //     ReportSource: resDataHdr[key].ReportSource,
          //     hasView: resDataHdr[key].hasView,
          //     hasPrintable: resDataHdr[key].hasPrintable,
          //     hasGraph: resDataHdr[key].hasGraph,
          //     IsActive: resDataHdr[key].IsActive,
          //     ReportGroup: resDataHdr[key].ReportGroup,
          //   });

          //   //     resolve(orderAddOnCost);
          // }
          // console.log("1", reportMaster);

          // const resDataCol = res.data.data[1];

          // for (const key in resDataCol) {
          //   // console.log(resDataCol[key].ColumnAllowFilter, "aa");
          //   reportMaster.reportMasterCol.push({
          //     Id: resDataCol[key].Id,
          //     ReportId: resDataCol[key].ReportId,
          //     ColumnName: resDataCol[key].ColumnName,
          //     ColumnTitle: resDataCol[key].ColumnTitle,
          //     ColumnWidth: resDataCol[key].ColumnWidth,
          //     ColumnDataType: resDataCol[key].ColumnDataType,
          //     ColumnPosition: resDataCol[key].ColumnPosition,
          //     ColumnFixed: resDataCol[key].ColumnFixed,
          //     ColumnAllowFilter: resDataCol[key].ColumnAllowFilter,
          //     ColumnAlign: resDataCol[key].ColumnAlign,
          //     ColumnShowToolTip: resDataCol[key].ColumnShowToolTip,
          //     ColumnParentName: resDataCol[key].ColumnParentName,
          //     ColumnShowSummary: resDataCol[key].ColumnShowSummary,
          //     ColumnSummaryType: resDataCol[key].ColumnSummaryType,
          //   });
          // }
          // console.log("2", reportMaster);
          // const resDataParam = res.data.data[2];

          // for (const key in resDataParam) {
          //   reportMaster.reportMasterParam.push({
          //     Id: resDataParam[key].Id,
          //     ReportId: resDataParam[key].ReportId,
          //     ParamDataSourcePosition:
          //       resDataParam[key].ParamDataSourcePosition,
          //     ParamName: resDataParam[key].ParamName,
          //     ParamDesc: resDataParam[key].ParamDesc,
          //     ParamType: resDataParam[key].ParamType,
          //     ParamDefValue: resDataParam[key].ParamDefValue,
          //     ParamPosition: resDataParam[key].ParamPosition,
          //     ParamIsVisible: resDataParam[key].ParamIsVisible,
          //     ParamDataSource: resDataParam[key].ParamDataSource,
          //     ParamIsCompulsary: resDataParam[key].ParamIsCompulsary,
          //     ParamPlaceHolder: resDataParam[key].ParamPlaceHolder,
          //     ParamNewLineAfter: resDataParam[key].ParamNewLineAfter,
          //     dataSource: [],
          //   });
          // }
          // console.log("3", reportMaster);
          // const resDataChartHdr = res.data.data[3];

          // for (const key in resDataChartHdr) {
          //   reportMaster.reportChartHdr.push({
          //     ChartId: resDataChartHdr[key].ChartId,
          //     ReportId: resDataChartHdr[key].ReportId,
          //     ChartSource: resDataChartHdr[key].ChartSource,
          //     ChartType: resDataChartHdr[key].ChartType,
          //     ChartTitle: resDataChartHdr[key].ChartTitle,
          //     ChartHeight: resDataChartHdr[key].ChartHeight,
          //     ChartWidth: resDataChartHdr[key].ChartWidth,
          //     ChartOption1: resDataChartHdr[key].ChartOption1,
          //     ChartOption2: resDataChartHdr[key].ChartOption2,
          //     ChartOption3: resDataChartHdr[key].ChartOption3,
          //     ChartOption4: resDataChartHdr[key].ChartOption4,
          //     ChartOption5: resDataChartHdr[key].ChartOption5,
          //     ChartOption6: resDataChartHdr[key].ChartOption6,
          //     ChartOption7: resDataChartHdr[key].ChartOption7,
          //     ChartOption8: resDataChartHdr[key].ChartOption8,
          //     ChartOption9: resDataChartHdr[key].ChartOption9,
          //     ChartOption10: resDataChartHdr[key].ChartOption10,
          //   });
          // }
          // console.log("4", reportMaster);
          // const resDataChartDtl = res.data.data[4];

          // for (const key in resDataChartDtl) {
          //   reportMaster.reportChartDtl.push({
          //     Id: resDataChartDtl[key].Id,
          //     ChartId: resDataChartDtl[key].ChartId,
          //     ReportId: resDataChartDtl[key].ReportId,
          //     ColumnName: resDataChartDtl[key].ColumnName,
          //     ColumnTitle: resDataChartDtl[key].ColumnTitle,
          //     ColumnDataType: resDataChartDtl[key].ColumnDataType,
          //     ColumnPosition: resDataChartDtl[key].ColumnPosition,
          //   });
          // }

          // return reportMaster;
        })
        .catch((err) => {
          console.error("rejected from fetchReportMaster", err);
          reject(err);
        });
      resolve(reportMaster);
    } catch (e) {
      console.error("rejected from fetchReportMaster", e);
      reject(e);
    }
  });
};

export function getReportPrintData(data, pType) {
  return new Promise(function (resolve, reject) {
    try {
      if (pType === "HTML") {
        axios
          .post(`${data.api_endpoint}`, data.parameter)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            console.log(err, "error html report");
          });
      } else {
        axios
          .post(`${data.api_endpoint}`, data.parameter, {
            responseType: "arraybuffer",
            headers: {
              Accept: "application/pdf",
            },
          })
          .then((res) => {
            resolve(res);
          });
      }
    } catch (e) {
      reject(e);
    }
  });
}
