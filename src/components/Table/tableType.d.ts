import { ReactNode } from "react";
import { TableCellProps } from "@mui/material";

export interface TableHeader {
  align: "right" | "left" | "center" | "inherit" | "justify";
  title: string;
  name?: string;
  tableProps?: TableCellProps;
}

export interface TableBody {
  align: "right" | "left" | "center" | "inherit" | "justify";
  tableProps?: TableCellProps;
  children: ReactNode;
}

export interface PaginationAndSort {
  page: number;
  size: number;
  totalPage: number;
  totalItems: number;
  search: string;
  sortBy: number;
  sortDirection: "asc" | "desc";
}
