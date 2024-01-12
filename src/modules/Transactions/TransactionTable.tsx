import Label from "@/components/MUIComponents/Label";
import { TableBody, TableHeader } from "@/components/Table/tableType";
import { transactionTypes } from "@/models/variables";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody as TBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import Paper from '@mui/material/Paper';
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

interface BettingList {
  betAmount: number;
  totalAmount: number;
}

const TransactionTable = (): TransactionTableProps => { 

  const tableBody = (item: any /* change to bettinglist when done */): TableBody[] => [
    {
      align: "left",
      children: (
        <>
          <Box>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1 }}
            >
              <Typography variant="body1" color="text.primary" >
                {item.details.gameName}
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1 }}
            >
            {item.details.gameType.map((type: string) => 
              <Chip label={type} variant="outlined" key={type} />
            )}
            </Stack>
          </Box>
        </>
      ),
    },
    {
      align: "right",
      children: (
        <>
          <Typography variant="body1" color="text.primary" noWrap>
            {item.betAmount >= 0 ? item.betAmount : Number(item.betAmount) * -1}
          </Typography>
        </>
      ),
    },
    {
      align: "right",
      children: (
        <>
          <Typography variant="body1" color="text.primary" noWrap>
            { item.totalAmount }
          </Typography>
        </>
      ),
    },
    {
      align: "right",
      children: (
        <>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <FormattedMessage id="label.transactions" />
          </AccordionSummary>
          <AccordionDetails>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Username</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">At</TableCell>
                </TableRow>
              </TableHead>
              {item.transactions.map((transaction: any) =>
              <TBody key={transaction.id}>
                <TableCell component="th" scope="row">
                  {transaction.username}
                </TableCell>
                <TableCell align="right">{transaction.type}</TableCell>
                <TableCell align="right">{transaction.amount}</TableCell>
                <TableCell align="right">{moment(transaction?.createdAt).format("dd/MM/yyyy HH:mm")}</TableCell>
              </TBody>
              )} 
            </Table>
          </TableContainer>
          </AccordionDetails>
        </Accordion>
        </>
      ),
    },
  ];
  const tableHeader: TableHeader[] = [
    {
      align: "right",
      title: "label.games",
      name: "details",
    },
    {
      align: "right",
      title: "label.bet.amount",
      name: "betAmount",
    },
    {
      align: "right",
      title: "label.total.amount",
      name: "betAmount",
    },
    {
      align: "right",
      title: "label.details",
      name: "details",
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
