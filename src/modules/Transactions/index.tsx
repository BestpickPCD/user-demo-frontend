import TableComponent from "@/components/Table";
import { Transactions } from "@/models";
import { useGetTransactionQuery } from "@/services/gamesService";
import { formatToISOString, onSortTable } from "@/utils";
import { useModal, useToast } from "@/utils/hooks";
import { useEffect, useState } from "react";
import TransactionTable from "./TransactionTable";

export interface PaginationAndSort {
  page: number;
  size: number;
  totalPage: number;
  totalItems: number;
  search: string;
  sortBy: number;
  sortDirection: "asc" | "desc";
}

interface TransactionPagination extends PaginationAndSort {
  type: string;
  dateFrom: string;
  dateTo: string;
}

const title = "title.transactions-management";
const TransactionManagement = (): JSX.Element => {
  const { tableBody, tableHeader, tableFilter } = TransactionTable();

  const [data, setData] = useState<Transactions[]>([]);
  const [pagination, setPagination] = useState<TransactionPagination>({
    page: 0,
    size: 10,
    totalPage: 1,
    totalItems: 10,
    sortBy: -1,
    search: "",
    sortDirection: "asc",
    type: "",
    dateFrom: "",
    dateTo: "",
  });

  const {
    data: transactionData,
    isFetching,
    refetch,
  } = useGetTransactionQuery(
    {
      id: 1,
      page: pagination.page,
      size: pagination.size,
      search: pagination.search,
      dateFrom: pagination.dateFrom,
      dateTo: pagination.dateTo,
      type: pagination.type,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (transactionData) {
      setData(() =>
        onSortTable(
          transactionData.data.data,
          tableHeader[pagination.sortBy]?.name || "",
          pagination.sortDirection
        )
      );
    }
  }, [transactionData, pagination.sortBy, pagination.sortDirection]);

  return (
    <>
      <TableComponent
        data={data}
        totalItems={transactionData?.data.totalItems}
        tableHeader={tableHeader}
        tableBody={tableBody}
        breadcrumbs={[]}
        isLoading={isFetching}
        pagination={pagination}
        onPagination={setPagination}
        tableFilter={tableFilter({
          type: {
            value: pagination.type,
            onChange: (value: any) =>
              setPagination({ ...pagination, type: value }),
          },
          dateFrom: {
            value: pagination.dateFrom,
            onChange: (value: any) =>
              setPagination({
                ...pagination,
                dateFrom: formatToISOString(value, "from"),
              }),
          },
          dateTo: {
            value: pagination.dateTo,
            onChange: (value: any) =>
              setPagination({
                ...pagination,
                dateTo: formatToISOString(value, "to"),
              }),
          },
        })}
      />
    </>
  );
};

export default TransactionManagement;
