/*
 * @Author: sun.t
 * @Date: 2022-03-20 01:15:31
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-09-08 14:29:12
 * @Description https://github.com/nadbm/react-datasheet/blob/master/USAGE_TYPESCRIPT.md
 */
import React, { FC, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Modal, Tabs } from "antd";
import moment from "moment";
import ReactDataSheet from "react-datasheet";
import { cloneDeep } from "lodash";
import Footer from "./Footer";
import { readWorkbookFromLocalFile, parse2Excel, parseTableData, Parse2ExcelReturn, fixImportedDate} from "./utils";
import "./styles.scss";
import "react-datasheet/lib/react-datasheet.css";
import { ErrorTypes } from "./types";
import type { XLSXUploaderProps, GridElement, WorkbookData, SheetRange } from "./types";
import { DEFAULT_I18N } from "./constant";
import { log } from "../../../utils/log";

const TabPane = Tabs.TabPane;

// let cellRenderer: ReactDataSheet.CellRenderer<GridElement, number> = (props) => {
//   const backgroundStyle = props.cell.value && props.cell.value < 0 ? { color: "red" } : undefined;
//   return (
//     <td
//       style={backgroundStyle}
//       onMouseDown={props.onMouseDown}
//       onMouseOver={props.onMouseOver}
//       onDoubleClick={props.onDoubleClick}
//       className="cell"
//     >
//       {props.children}
//     </td>
//   );
// };

class TypeReactDataSheet extends ReactDataSheet<GridElement, number> {}

const XlsxUploader: FC<XLSXUploaderProps> = ({
  i18n = DEFAULT_I18N,
  modalWidth = 700,
  preview = true,
  defaultRange,
  xlsx,
  onError,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // 预览窗口显示
  const [previewVisible, setPreviewVisible] = useState(false);
  // 原始数据
  const [excelData, setExcelData] = useState<Parse2ExcelReturn[]>([]);
  // excel数据
  const [workbookData, setWorkbookData] = useState<WorkbookData>([]);
  // 当前活跃sheet下标
  const [activeSheetIndex, setActiveSheetIndex] = useState<string | undefined>("0");
  // 当前导入文件名称
  const [fileName, setFileName] = useState<string>("");
  // 当前workbook各类型对应区域
  const [workbookRange, setWorkbookRange] = useState<SheetRange[] | undefined>(defaultRange);
  // 当前sheet选中区域
  const [selectedCell, setSelectedCell] = useState<ReactDataSheet.Selection | null>(null);
  // 当前选中行代表列头/数据
  const [selectedOption, setSelectedOption] = useState<keyof SheetRange>("header");

  // 当前页范围配置
  const sheetRange = workbookRange && workbookRange.length && activeSheetIndex ? workbookRange[Number(activeSheetIndex)] : {};

  const onSelect = useCallback(
    ({ start, end }) => {
      if (!activeSheetIndex) return;

      setSelectedCell({ start, end });

      const newWorkbookRange = [...(workbookRange || [])];

      const currentIndexSheetRange = newWorkbookRange[Number(activeSheetIndex)] || {};

      newWorkbookRange[Number(activeSheetIndex)] = { ...currentIndexSheetRange, [selectedOption]: { start, end } };

      setWorkbookRange(newWorkbookRange);
    },
    [workbookRange, activeSheetIndex, selectedOption]
  );

  const reset = useCallback(() => {
    inputRef.current && (inputRef.current.value = "");
    // 初始化默认选择
    setWorkbookRange(cloneDeep(defaultRange));
    setSelectedCell(null);
  }, [defaultRange]);

  const errorHandler = useCallback(
    (type, e) => {
      reset();

      onError && onError(type, e);
    },
    [onError, reset]
  );

  const onRangeTypeSelected = useCallback(
    (value: keyof SheetRange) => {
      setSelectedOption(value);
      if (workbookRange && workbookRange[Number(activeSheetIndex)]) {
        setSelectedCell(workbookRange[Number(activeSheetIndex)][value] || null);
      } else {
        setSelectedCell(null);
      }
    },
    [workbookRange, activeSheetIndex]
  );

  const onSheetIndexChange = useCallback(
    (value) => {
      setActiveSheetIndex(value);
      if (workbookRange && workbookRange[Number(value)]) {
        setSelectedCell(workbookRange[Number(value)][selectedOption] || null);
      } else {
        setSelectedCell(null);
      }
    },
    [workbookRange, selectedOption]
  );

  const submit = useCallback(() => {
    onSubmit &&
      onSubmit({
        excelData,
        table: workbookData.map(({ sheetData }, index) =>
          parseTableData({ range: workbookRange ? workbookRange[index] : undefined, sheetData })
        ),
      });
  }, [excelData, workbookData, workbookRange, onSubmit]);

  const onFile = useCallback(
    (workbook) => {
      const isDate1904 = workbook.Workbook?.WBProps?.date1904;
      const excelContent = parse2Excel(workbook);
      setExcelData(excelContent);

      const tempWorkbookData = excelContent.map(({ json, sheetName }) => {
        const sheetData: any[][] = [];

        json.forEach((row) => {
          const rowData: any[] = [];

          Object.keys(row).forEach((columnName) => {
            
            const rowValue = row[columnName];
            const value = typeof rowValue === "undefined" ? null:fixImportedDate(rowValue, isDate1904);
            rowData.push({value});
          });

          sheetData.push(rowData);
        });

        return {
          sheetName,
          sheetData,
        };
      });

      setWorkbookData(tempWorkbookData);

      if (preview) {
        setPreviewVisible(true);

        if (tempWorkbookData.length) {
          setActiveSheetIndex("0");
          setSelectedOption("header");

          if (defaultRange && defaultRange[0] && defaultRange[0].header) {
            setSelectedCell(defaultRange[0].header);
          }
        }
      } else {
        onSubmit &&
          onSubmit({
            excelData: excelContent,
            table: tempWorkbookData.map(({ sheetData }, index) =>
              parseTableData({ range: defaultRange ? defaultRange[index] : undefined, sheetData })
            ),
          });
        // 重置
        reset();
      }
    },
    [defaultRange, onSubmit, preview, reset]
  );

  const openFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  // 暴露api
  useImperativeHandle(xlsx, () => ({
    openFile,
  }));

  return (
    <>
      <input
        ref={inputRef}
        className="ease-xlsx-input"
        type="file"
        accept=".xlsx, .xls"
        onChange={(fileData) => {
          const { files } = fileData.target;

          if (files && files.length) {
            const file = files[0];

            const { name } = file;

            if (!name.includes("xlsx") && !name.includes("xls")) {
              errorHandler(ErrorTypes.typeError, new Error("文件格式不正确"));
              return;
            }

            setFileName(file.name);

            readWorkbookFromLocalFile(file, onFile, errorHandler);
          } else {
            errorHandler(ErrorTypes.emptyFile, new Error("未读取到file对象"));
            log({ module: "XlsxReader", sketch: "未读取到file对象", type: "error" });
          }
        }}
      />

      <Modal
        width={modalWidth}
        title={fileName}
        visible={previewVisible}
        footer={
          <Footer i18n={i18n} range={sheetRange} rangeType={selectedOption} onRangeTypeSelected={onRangeTypeSelected} submit={submit} />
        }
        onCancel={() => {
          setPreviewVisible(false);
          reset();
        }}
      >
        {workbookData.length ? (
          <>
            <TypeReactDataSheet
              selected={selectedCell}
              data={workbookData[Number(activeSheetIndex)].sheetData}
              valueRenderer={(cell) => (cell.value instanceof Date ? moment(cell.value).format("YYYY-MM-DD") : cell.value)}
              onSelect={onSelect}
            />

            <Tabs
              activeKey={activeSheetIndex}
              onChange={onSheetIndexChange}
              tabPosition="bottom"
              className="ease-xlsx-tabs"
              tabBarGutter={0}
              tabBarStyle={{ margin: 0 }}
            >
              {workbookData.map(({ sheetName }) => (
                <TabPane tab={<div className="ease-xlsx-tab">{sheetName}</div>} key={sheetName} />
              ))}
            </Tabs>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default XlsxUploader;
