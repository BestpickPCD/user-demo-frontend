import { Box, Container, Grid } from "@mui/material";
import { ReactNode, memo } from "react";
import { useIntl } from "react-intl";
import Footer from "@/components/Footer";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { Breadcrumbs } from "../Breadcrumbs/type";
import PageHeader from "./PageHeader";
import Table from "./Table";
import { PaginationAndSort, TableBody, TableHeader } from "./tableType";

interface TableProps<D, P> {
  title?: string;
  data: D[];
  tableHeader?: TableHeader[];
  headerTitle?: string;
  headerSubtitle?: string;
  isLoading?: boolean;
  breadcrumbs?: Breadcrumbs[];
  pagination?: P;
  tableFilter?: ReactNode[];
  extraOptions?: ReactNode[];
  totalItems?: number;
  onPagination?: (value: any) => void;
  onUpdate?: (value: string | number) => void;
  onDelete?: (value: string | number) => void;
  onOpenModal?: () => void;
  tableBody?: (item: TableBody[]) => TableBody[];
}

const TableComponent = ({
  data = [],
  tableHeader = [
    {
      align: "inherit",
      title: "Title",
    },
  ],
  isLoading = false,
  pagination,
  tableFilter,
  totalItems,
  extraOptions,
  onOpenModal,
  tableBody,
  onDelete,
  onUpdate,
  onPagination,
}: TableProps<any, PaginationAndSort>): JSX.Element => {
  return (
    <Box sx={{ marginTop: 10 }}>
      <Container maxWidth="lg">
        <Box py={2}>
          <PageHeader
            onOpenModal={onOpenModal}
            headerTitle={""}
            headerSubtitle={""}
            breadcrumbs={[]}
          />
        </Box>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Table
              data={data}
              totalItems={totalItems || 0}
              tableHeader={tableHeader}
              tableBody={tableBody as any}
              isLoading={isLoading}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onPagination={onPagination as any}
              pagination={pagination as any}
              tableFilter={tableFilter}
              extraOptions={extraOptions}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default memo(TableComponent);
