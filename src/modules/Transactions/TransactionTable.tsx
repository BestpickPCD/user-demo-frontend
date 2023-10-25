import Label from "@/components/MUIComponents/Label";
import { TableBody, TableHeader } from "@/components/Table/tableType";
import { Transactions } from "@/models";
import { transactionTypes } from "@/models/variables";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
interface TransactionTableProps {
  tableHeader: TableHeader[];
  tableBody: (item: any) => TableBody[];
  tableFilter: ({ type, dateFrom, dateTo }: any) => ReactNode[];
}
interface TableFilterProps {
  type: {
    value: string;
    onChange: (value: string) => void;
  };
  dateFrom: {
    value: string;
    onChange: (value: any) => void;
  };
  dateTo: {
    value: string;
    onChange: (value: any) => void;
  };
}
interface StatusData {
  text: string;
  color?:
    | "primary"
    | "black"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "info";
}

const getStatusLabel = (status: string): JSX.Element => {
  const data: { [key: string]: StatusData } = {
    failed: {
      text: "Failed",
      color: "error",
    },
    success: {
      text: "Success",
      color: "success",
    },
    ok: {
      text: "Ok",
      color: "success",
    },
    pending: {
      text: "Pending",
      color: "primary",
    },
    cancelled: {
      text: "Cancel",
      color: "warning",
    },
  };
  if (data[status]) {
    const { text, color } = data[status];
    return <Label color={color}>{text}</Label>;
  }
  return <Label>{status}</Label>;
};

const TransactionTable = (): TransactionTableProps => {
  const tableBody = (item: Transactions): TableBody[] => [
    {
      align: "right",
      children: (
        <>
          <Typography variant="body1" color="text.primary" noWrap>
            {item.type === "bet" ||
            item.type === "win" ||
            item.type === "cancel"
              ? item.amount
              : Number(item.amount) * -1}
          </Typography>
        </>
      ),
    },
    {
      align: "right",
      children: (
        <>
          <Typography variant="body1" color="text.primary" noWrap>
            {`${item.type.slice(0, 1).toUpperCase()}${item.type.slice(1)}`}
          </Typography>
        </>
      ),
    },
    {
      align: "right",
      children: (
        <>
          <Typography variant="body1" color="text.primary" noWrap>
            {getStatusLabel(item.status)}
          </Typography>
        </>
      ),
    },
    {
      align: "right",
      children: (
        <>
          <Typography variant="body1" color="text.primary" noWrap>
            {item?.updatedAt &&
              moment(item?.updatedAt).format("dd/MM/yyyy HH:mm")}
          </Typography>
        </>
      ),
    },
  ];
  const tableHeader: TableHeader[] = [
    {
      align: "right",
      title: "label.amount",
      name: "amount",
    },
    {
      align: "right",
      title: "label.title",
      name: "type",
    },
    {
      align: "right",
      title: "label.status",
      name: "status",
    },
    {
      align: "right",
      title: "label.updated.at",
      name: "updatedAt",
    },
    {
      align: "right",
      title: "label.actions",
    },
  ];
  const tableFilter = ({ type, dateFrom, dateTo }: TableFilterProps) => [
    <DatePicker
      key="label.from"
      label={<FormattedMessage id="label.from" />}
      onChange={dateFrom.onChange}
    />,
    <DatePicker
      key="label.to"
      label={<FormattedMessage id="label.to" />}
      onChange={dateTo.onChange}
    />,
    <FormControl sx={{ maxWidth: 140, width: 140 }} key="label.type">
      <InputLabel id="Type">
        <FormattedMessage id="label.type" />
      </InputLabel>
      <Select
        labelId="Type"
        value={type.value}
        label={<FormattedMessage id="label.type" />}
        onChange={(e) => type.onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>Default</em>
        </MenuItem>
        {transactionTypes.map((item) => (
          <MenuItem key={item} value={item}>
            {`${item.slice(0, 1).toUpperCase()}${item.slice(1)}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>,
  ];

  return { tableBody, tableHeader, tableFilter };
};

export default TransactionTable;
