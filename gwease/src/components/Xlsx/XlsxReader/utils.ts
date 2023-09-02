import * as XLSX from "xlsx";
import { GridElement, Range, SheetRange, ErrorTypes } from "./types";

// 读取本地excel文件
export function readWorkbookFromLocalFile(file: File, callback: any, onError: any) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = e.target!.result;
    // 读取二进制的excel
    try {
      const workbook = XLSX.read(data, { type: "binary", cellDates: true });
      if (callback) callback(workbook);
    } catch (error) {
      onError && onError(ErrorTypes.xlsxParseError, error);
    }
  };
  reader.readAsBinaryString(file);
}
// 读取远程文件
// export function readWorkbookFromRemoteFile(url: string, callback: any) {
//   const xhr = new XMLHttpRequest();
//   xhr.open("get", url, true);
//   xhr.responseType = "arraybuffer";
//   xhr.onload = function (e) {
//     if (xhr.status == 200) {
//       const data = new Uint8Array(xhr.response);
//       const workbook = XLSX.read(data, { type: "array" });
//       if (callback) callback(workbook);
//     }
//   };
//   xhr.send();
// }

export interface Parse2ExcelReturn {
  sheetName: string;
  sheet: string[];
  json: Record<string, any>[];
  tableHtml: string;
}

//
export function parse2Excel(workbook: XLSX.WorkBook): Parse2ExcelReturn[] {
  const { Sheets } = workbook;
  const data: any[] = [];
  workbook.SheetNames.forEach((sheetName) => {
    const sheetData = Sheets[sheetName];

    // 空sheet会造成sheet_to_html等函数出错
    if (typeof sheetData["!ref"] !== "undefined") {
      data.push({
        sheetName,
        sheet: XLSX.utils.sheet_to_formulae(sheetData),
        json: XLSX.utils.sheet_to_json(sheetData, {
          defval: null,
        }),
        tableHtml: XLSX.utils.sheet_to_html(sheetData),
      });
    }
  });

  return data;
}

export function parse2json(workbook: XLSX.WorkBook) {
  const { Sheets } = workbook;
  let data: any[] = [];
  for (const sheet in Sheets) {
    if (Sheets.hasOwnProperty(sheet)) {
      data = data.concat(XLSX.utils.sheet_to_json(Sheets[sheet]));
    }
  }
  return data;
}

function predefineRange({ range, sheetData }: { range?: SheetRange; sheetData: GridElement[][] }) {
  if (typeof range === "undefined" && sheetData.length > 1) {
    return {
      header: { start: { i: 0, j: 0 }, end: { i: 0, j: sheetData[0].length - 1 } },
      data: { start: { i: 1, j: 0 }, end: { i: sheetData.length - 1, j: sheetData[0].length - 1 } },
    };
  }

  return range;
}

export function range2str(range?: Range) {
  if (!range) return "";
  const { start, end } = range;
  return `${start.i},${start.j}-${end.i},${end.j}`;
}

export function parseTableData({ range, sheetData }: { range?: SheetRange; sheetData: GridElement[][] }) {
  const tempRange = predefineRange({ range, sheetData });

  if (typeof tempRange === "undefined") {
    return { columns: [], data: [] };
  }
  const { header, data } = tempRange;

  const temp: { columns: (number | null)[]; data: any[] } = { columns: [], data: [] };

  if (header) {
    const { start, end } = header;
    const startRowIndex = start.i;
    const startColumnIndex = start.j;
    const endColumnIndex = end.j;
    temp.columns = sheetData[startRowIndex].slice(startColumnIndex, endColumnIndex - startColumnIndex + 1).map(({ value }) => value);
  }

  if (data) {
    const { start, end } = data;
    const startRowIndex = start.i;
    const startColumnIndex = start.j;
    const endRowIndex = end.i;
    const endColumnIndex = end.j;
    // eslint-disable-next-line no-plusplus
    for (let row = startRowIndex; row <= endRowIndex; row++) {
      if (sheetData[row]) {
        const rowData = [];
        // eslint-disable-next-line no-plusplus
        for (let column = startColumnIndex; column <= endColumnIndex; column++) {
          const value = sheetData[row][column] ? sheetData[row][column].value : null;
          rowData.push(value);
        }
        temp.data.push(rowData);
      }
    }
  }
  return temp;
}


/**
 * Fix by shanwen bi 日期时间修复，修复日期转换 43秒误差
 * github issue: https://github.com/SheetJS/sheetjs/issues/1565
 */
const baseDate = new Date(1899, 11, 30, 0, 0, 0);
const dnthresh = baseDate.getTime() + (new Date().getTimezoneOffset() - baseDate.getTimezoneOffset()) * 60000;

const day_ms = 24 * 60 * 60 * 1000;
const days_1462_ms = 1462 * day_ms;

function datenum(v: any, date1904: boolean | undefined) {
  let epoch = v.getTime();
  if (date1904) {
    epoch -= days_1462_ms;
  }
  return (epoch - dnthresh) / day_ms;
}

export function fixImportedDate(data: any, is_date1904: boolean | undefined) {
  if (data instanceof Date) {
    const parsed = XLSX.SSF.parse_date_code(datenum(data, false), {date1904: is_date1904});
    return new Date(parsed.y, (parsed.m-1), parsed.d, parsed.H, parsed.M, parsed.S);
  }
  return data;
}