import { MutableRefObject } from "react";
import ReactDataSheet from "react-datasheet";

export type Range = ReactDataSheet.Selection;

export enum ErrorTypes {
  xlsxParseError,
  emptyFile,
  typeError,
}

export interface I18n {
  header: string;
  data: string;
  headerPlaceholder: string;
  dataPlaceHolder: string;
  ok: string;
  dataRequired: string;
  headerRequired: string;
}

export type SheetRange = { header?: ReactDataSheet.Selection; data?: ReactDataSheet.Selection };

export interface XlsxReaderInstance {
  openFile: () => void;
}

export interface XLSXUploaderProps {
  text?: string;
  i18n?: I18n;
  preview?: boolean;
  modalWidth?: number;
  defaultRange?: SheetRange[];
  xlsx?: MutableRefObject<XlsxReaderInstance | undefined>;
  onError?: (type: ErrorTypes, e: any) => void;
  onSubmit: (data: any) => void;
}

export interface XLSXUploaderFooterProps {
  i18n?: I18n;
  range?: SheetRange;
  rangeType: string;
  onRangeTypeSelected: (s: keyof SheetRange) => void;
  submit: () => void;
}

export interface GridElement extends ReactDataSheet.Cell<GridElement, number> {
  value: any;
}

export interface SheetData {
  sheetName: string;
  sheetData: GridElement[][];
}

export type WorkbookData = SheetData[];
