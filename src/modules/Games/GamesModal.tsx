import Modals from "@/components/Modals";
import { useOpenGameMutation } from "@/services/gamesService";
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import Image from "next/image";
import NextImage from "next/image";
import React, { ReactNode, useEffect, useRef, useState } from "react";
interface GamesModalProps {
  data: any;
  directUrl: boolean;
  visible: boolean;
  title: ReactNode;
  toggle: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const getColor = (index: number) => {
  if (index % 4 === 0) {
    return "rgba(255, 255, 255, 0.1)";
  }
  if (index % 4 === 1) {
    return "rgba(148, 170, 237, 0.1)";
  }
  if (index % 4 === 2) {
    return "rgba(166, 235, 185, 0.1)";
  }
  if (index % 4 === 3) {
    return "rgba(224, 234, 139, 0.1)";
  }
  return "rgba(94, 29, 29, 0.1)";
};

const GamesModal = ({ data, visible, title, toggle, directUrl }: GamesModalProps) => {

  const user = localStorage.getItem("user"); 
  const [urlOpenGame] = useOpenGameMutation(); 
  const openGame = async (details:any) => {
    const { id: gameId, vendor } = details;
    const { username } = JSON.parse(user as string);
    const { data } = await urlOpenGame({ gameId, vendor, directUrl, username }).unwrap(); 
    setIFrameUrl(data.link);
    setOpen(true);
  };

  const [iframeUrl, setIFrameUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Modals open={visible} onClose={toggle} maxWidth="lg" modalTitle={title}>
      <Box padding={2}>
        <Grid container columns={{ xs: 8, sm: 12, md: 16, lg: 20 }} spacing={2}>
          {data?.map((row: any, index: number) => (
            <Grid
              item
              xs={4}
              sm={4}
              md={4}
              lg={4}
              position="relative"
              key={`${row.url}-${index}`}
            >
              <Box height="100%" width="100%" onClick={() => openGame(row)}>
                <div className="game-detail">
                  <div className="card">
                    <NextImage
                      src={row.img}
                      alt={row.name}
                      loading="lazy"
                      fill={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Box
                      width="100%"
                      height="100%"
                      minHeight={200}
                      minWidth={150}
                    >
                      <Box
                        textAlign="center"
                        position={"absolute"}
                        top="50%"
                        left="50%"
                        width="100%"
                        zIndex={-10}
                        sx={{ transform: "translate(-50%, -50%)" }}
                      >
                        <CircularProgress />
                        <Typography style={{ opacity: 1 }}>
                          Loading...
                        </Typography>
                      </Box>
                    </Box>
                    <div className="override-circle">
                      <div
                        className="circle"
                        style={{ background: getColor(index) }}
                      />
                    </div>
                    <div className="card-content">
                      <span className="game-title" title={row.name}>
                        {row.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Box>
            </Grid>
          ))}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Container sx={style}>
              <iframe
                src={iframeUrl}
                title="Modal iframe"
                width={"100%"}
                height={600}
              />
            </Container>
          </Modal>
        </Grid>
      </Box>
    </Modals>
  );
};

export default GamesModal;
