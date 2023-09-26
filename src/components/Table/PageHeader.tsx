import { Typography, Button, Grid, Box } from "@mui/material";

import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import Breadcrumbs from "../Breadcrumbs";
import { Breadcrumbs as BreadcrumbsType } from "../Breadcrumbs/type";
import { memo } from "react";
import { FormattedMessage } from "react-intl";

interface PageHeaderProps {
  headerTitle: string;
  headerSubtitle: string;
  breadcrumbs: BreadcrumbsType[];
  onOpenModal?: () => void;
}
const PageHeader = ({
  headerTitle,
  headerSubtitle,
  breadcrumbs,
  onOpenModal,
}: PageHeaderProps): JSX.Element => (
  <Grid container justifyContent="space-between" alignItems="center">
    <Grid item>
      {headerTitle && (
        <Typography variant="h3" component="h3" gutterBottom>
          <FormattedMessage id={headerTitle} />
        </Typography>
      )}
      <Typography variant="subtitle2">{headerSubtitle}</Typography>
      {breadcrumbs && (
        <Box marginTop="8px">
          <Breadcrumbs links={breadcrumbs} />
        </Box>
      )}
    </Grid>
    {onOpenModal && (
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={onOpenModal}
        >
          <FormattedMessage id="label.create" />
        </Button>
      </Grid>
    )}
  </Grid>
);

export default memo(PageHeader);
