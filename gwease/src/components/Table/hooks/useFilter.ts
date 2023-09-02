import { useMemo, useState } from "react";
import { DataSource, OnFilter } from "../types";

interface UseFilterProps<RecordType> {
  dataSource: DataSource;
  onFilter?: OnFilter<RecordType>;
}

export default function useFilter<RecordType>({ dataSource, onFilter }: UseFilterProps<RecordType>) {
  const [filterValue, setFilterValue] = useState("");

  // 过滤
  const filterDataSource = useMemo(() => {
    if (filterValue.trim() === "" || typeof onFilter !== "function") {
      return dataSource;
    }

    return dataSource.filter((item) => onFilter(item, filterValue));
  }, [filterValue, dataSource, onFilter]);

  return {
    filterDataSource,
    setFilterValue,
  };
}
