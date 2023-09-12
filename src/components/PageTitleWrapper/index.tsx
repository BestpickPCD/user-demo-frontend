import { Box, Container, styled } from "@mui/material";
import { ReactNode } from "react";

const PageTitle = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(4)};
`
);

interface PageTitleWrapperProps {
  children?: ReactNode;
}

const PageTitleWrapper = ({ children }: PageTitleWrapperProps): JSX.Element => (
  <PageTitle className="MuiPageTitle-wrapper">
    <Container maxWidth="lg">{children}</Container>
  </PageTitle>
);
export default PageTitleWrapper;
