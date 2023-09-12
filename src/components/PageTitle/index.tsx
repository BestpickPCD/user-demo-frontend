import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Button, Grid, Typography } from '@mui/material';

interface PageTitleProps {
  heading?: string;
  subHeading?: string;
  docs?: string;
}

const PageTitle = ({
  heading = '',
  subHeading = '',
  docs = '',
  ...rest
}: PageTitleProps): JSX.Element => (
  <Grid container justifyContent="space-between" alignItems="center" {...rest}>
    <Grid item>
      <Typography variant="h3" component="h3" gutterBottom>
        {heading}
      </Typography>
      <Typography variant="subtitle2">{subHeading}</Typography>
    </Grid>
    <Grid item>
      <Button
        href={docs}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ mt: { xs: 2, md: 0 } }}
        variant="contained"
        startIcon={<AddTwoToneIcon fontSize="small" />}
      >
        {heading} Documentation
      </Button>
    </Grid>
  </Grid>
);

export default PageTitle;
