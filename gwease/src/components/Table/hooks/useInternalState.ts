import { useEffect, useState } from "react";
import { Columns, DataSource } from "../types";

interface UseInternalStateProps {
  dataSource?: DataSource;
  columns?: Columns;
}

const EMPTY_DATA_SOURCE: any[] = [];
const EMPTY_COLUMNS: any[] = [];

export default function useInternalState({ dataSource = EMPTY_DATA_SOURCE, columns = EMPTY_COLUMNS }: UseInternalStateProps) {
  const [internalDataSource, setInternalDataSource] = useState<DataSource>(dataSource);
  const [internalColumns, setInternalColumns] = useState<Columns>(columns);

  useEffect(() => {
    setInternalDataSource(dataSource);
  }, [dataSource]);

  useEffect(() => {
    setInternalColumns(columns);
  }, [columns]);

  return {
    internalDataSource,
    internalColumns,
  };
}
