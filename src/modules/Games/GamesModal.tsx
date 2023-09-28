import Modals from "@/components/Modals";
import { Box, Card, Grid, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactNode } from "react";
interface GamesModalProps {
  data: any;
  visible: boolean;
  title: ReactNode;
  toggle: () => void;
}
const GamesModal = ({ data, visible, title, toggle }: GamesModalProps) => {
  return (
    <Modals open={visible} onClose={toggle} maxWidth="lg" modalTitle={title}>
      <Box padding={2}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 8, sm: 8, md: 12 }}
        >
          {data?.map((item: any) => (
            <Grid key={item.id} item xs={4} sm={4} md={3}>
              <Card>
                <Box padding={1}>
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={100}
                    height={100}
                    layout="responsive"
                  />
                </Box>
                <Typography padding={1}>{item.title}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modals>
  );
};

export default GamesModal;
