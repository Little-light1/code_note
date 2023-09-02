import { TableProps } from "antd";
import { useCallback } from "react";
import { Columns } from "../types";

interface UseRowProps<RecordType = any> {
  onRow: TableProps<RecordType>["onRow"];
  columns: Columns;
}

export default function useRow<RecordType>({ onRow, columns }: UseRowProps<RecordType>) {
  const onInternalRow = useCallback(
    (record, index) => {
      const extraRowProps = onRow ? onRow(record, index) : {};

      return {
        ...extraRowProps,
        columns,
        record,
        index,
      };
    },
    [columns, onRow]
  );

  return { onInternalRow };
}
