import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import {
  ChangeEvent,
  ReactNode,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useModal } from "@/utils/hooks";
import BulkActions from "./BulkActions";
import {
  PaginationAndSort,
  TableBody as TableBodyType,
  TableHeader,
} from "./tableType";
const LoadingButtonCustom = styled(LoadingButton)`
  background: #5569ff !important;
  color: white !important;
`;
import { v4 as uuid } from "uuid";
import useDebounce from "@/utils/hooks/useDebounce";
import { FormattedMessage } from "react-intl";
interface TableProps<P> {
  className?: string;
  data: any[];
  totalItems: number;
  tableHeader: TableHeader[];
  isLoading: boolean;
  pagination: P;
  tableFilter?: ReactNode[];
  extraOptions?: ReactNode[];
  tableBody: (item: unknown) => TableBodyType[];
  onDelete?: (value: number | string) => void;
  onUpdate?: (value: number | string) => void;
  onPagination: (value: unknown) => void;
}

const Table = ({
  data,
  tableHeader,
  isLoading,
  pagination,
  totalItems = 0,
  tableFilter,
  extraOptions,
  tableBody,
  onDelete,
  onUpdate,
  onPagination,
}: TableProps<PaginationAndSort>): JSX.Element => {
  const theme = useTheme();
  const { visible, show, hide } = useModal();
  const [rowId, setRowId] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const onSelectedAllRows = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedRows(event.target.checked ? data.map((item) => item.id) : []);
  };

  const onSelectedRow = (
    event: ChangeEvent<HTMLInputElement>,
    itemId: string
  ): void => {
    if (!selectedRows.includes(itemId)) {
      setSelectedRows((prevSelected) => [...prevSelected, itemId]);
    } else {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((id) => id !== itemId)
      );
    }
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ): void => {
    onPagination({ ...pagination, page: newPage } as PaginationAndSort);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onPagination({
      ...pagination,
      size: Number(event.target.value),
    } as PaginationAndSort);
  };

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  useEffect(() => {
    onPagination({
      ...pagination,
      search: debouncedSearchTerm,
    } as PaginationAndSort);
  }, [debouncedSearchTerm]);

  const selectedSomeRows =
    selectedRows.length > 0 && selectedRows.length < data.length;
  const selectedAllRows = selectedRows.length === data.length;

  const handleShow = (id: string) => {
    show();
    setRowId(id);
  };

  const onSort = (index: number) => {
    const newPagination = {
      ...pagination,
      sortBy: index,
      sortDirection:
        pagination.sortBy === index
          ? pagination.sortDirection === "asc"
            ? "desc"
            : "asc"
          : "asc",
    } as PaginationAndSort;
    onPagination(newPagination);
  };

  const TableHeaderMemo = useMemo(() => {
    if (!onDelete && !onUpdate) {
      tableHeader.pop();
    }
    return tableHeader;
  }, [onDelete, onUpdate]);

  const ToolTipDelete = ({
    item,
    hide,
    onDelete,
    handleShow,
    rowId,
    visible,
    theme,
    isLoading,
  }: any) => (
    <Tooltip
      title={
        <Container>
          <Typography variant="h5" sx={{ marginTop: "4px", width: "100%" }}>
            Are you sure want to delete?
          </Typography>
          <Container
            sx={{
              display: "flex",
              gap: "12px",
              padding: "12px 0 8px",
            }}
          >
            <Button variant="outlined" onClick={hide}>
              No
            </Button>
            <LoadingButtonCustom
              onClick={() => onDelete(item.id)}
              loading={isLoading}
              loadingPosition="start"
              startIcon={<SendIcon />}
              variant="contained"
              sx={{
                width: "80px",
              }}
            >
              Yes
            </LoadingButtonCustom>
          </Container>
        </Container>
      }
      arrow
      open={item.id === rowId && visible && !isLoading}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      PopperProps={{
        disablePortal: true,
      }}
    >
      <IconButton
        sx={{
          "&:hover": { background: theme.colors.error.lighter },
          color: theme.palette.error.main,
        }}
        color="inherit"
        size="small"
        onClick={() => handleShow(item.id)}
      >
        <DeleteTwoToneIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <Card>
      {selectedRows?.length > 0 && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      <Divider />
      <Card
        sx={{
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "max-content",
          }}
        >
          <TextField
            label={<FormattedMessage id="label.search" />}
            variant="outlined"
            onChange={(event) => setSearchTerm(event.target.value.trim())}
          />
          <IconButton
            type="button"
            sx={{
              p: "10px",
              position: "absolute",
              right: 0,
              ":hover": { background: "unset" },
            }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" gap="0.5rem">
          {tableFilter?.map((filterItem, index) => (
            <Box key={index}>{filterItem}</Box>
          ))}
        </Box>
      </Card>
      <TableContainer>
        <MUITable>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllRows}
                  indeterminate={selectedSomeRows}
                  onChange={onSelectedAllRows}
                />
              </TableCell>
              {TableHeaderMemo.map((headerItem, index) => (
                <TableCell
                  key={uuid()}
                  {...headerItem.tableProps}
                  align={headerItem.align}
                >
                  {(!!headerItem.name as boolean) ? (
                    <TableSortLabel
                      active={pagination.sortBy === index}
                      direction={
                        pagination.sortBy === index
                          ? pagination.sortDirection
                          : "asc"
                      }
                      onClick={() => onSort(index)}
                    >
                      <FormattedMessage id={headerItem.title} />
                    </TableSortLabel>
                  ) : (
                    <FormattedMessage id={headerItem.title.toLowerCase()} />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              position: "relative",
              minHeight: "100px",
              height: !data || data.length >= 0 ? "100px" : "unset",
            }}
          >
            {data.map((item) => {
              const isItemSelected = selectedRows.includes(item.id);
              return (
                <TableRow hover key={uuid()} selected={isItemSelected}>
                  <TableCell padding="checkbox" key={uuid()}>
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        onSelectedRow(event, item.id)
                      }
                      value={isItemSelected}
                    />
                  </TableCell>
                  {tableBody(item)?.map((item) => (
                    <TableCell
                      align={item.align}
                      key={uuid()}
                      sx={{ ...item.tableProps }}
                    >
                      {item.children}
                    </TableCell>
                  ))}
                  {(onUpdate || onDelete) && (
                    <TableCell align="right" key={uuid()}>
                      {extraOptions?.map((child, index) => (
                        <Tooltip title="" arrow key={index}>
                          {child as React.ReactElement}
                        </Tooltip>
                      ))}
                      {onUpdate && (
                        <Tooltip
                          title={<FormattedMessage id="label.view.edit" />}
                          arrow
                        >
                          <IconButton
                            color="inherit"
                            size="small"
                            onClick={() => onUpdate(item.id)}
                          >
                            <EditTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete &&
                        ToolTipDelete({
                          item,
                          rowId,
                          visible,
                          theme,
                          isLoading,
                          handleShow,
                          onDelete,
                          hide,
                        })}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {isLoading && (
              <TableRow>
                <TableCell>
                  <Box
                    position={"absolute"}
                    top={"50%"}
                    left={"50%"}
                    width={"100%"}
                    height={"100%"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{
                      transform: "translate(-50%, -50%)",
                      background: "rgba(255, 255, 255, 0.5)",
                      zIndex: 100,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MUITable>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={totalItems}
          onPageChange={handlePageChange as any}
          onRowsPerPageChange={handleLimitChange}
          page={pagination.page}
          rowsPerPage={pagination.size}
          rowsPerPageOptions={[5, 10, 25, 30]}
          showLastButton
          showFirstButton
        />
      </Box>
    </Card>
  );
};

export default memo(Table);
