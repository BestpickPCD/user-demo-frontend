import Modals from "@/components/Modals";
import { useOpenGameMutation } from "@/services/gamesService";
import { Box, Card, Container, Dialog, DialogContent, DialogTitle, Grid, Modal, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactNode } from "react";
interface GamesModalProps {
  data: any;
  visible: boolean;
  title: ReactNode;
  toggle: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24
};


const GamesModal = ({ data, visible, title, toggle }: GamesModalProps) => { 

  const [urlOpenGame] = useOpenGameMutation();

  const openGame = async (gameId: string) => {
    const { data } = await urlOpenGame({gameId}).unwrap();
    console.log(data.url)
    setIFrameUrl(data.url)
    setOpen(true)
  }
 
  const [iframeUrl, setIFrameUrl] = React.useState('')
  const [open, setOpen] = React.useState(false); 
  const handleClose = () => setOpen(false);

  return (
    <Modals open={visible} onClose={toggle} maxWidth="lg" modalTitle={title}>
      <Box padding={2}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 8, sm: 8, md: 12 }}
        >
          {Array.isArray(data) && 
          data?.map((item: any) => (
            <Grid key={item.id} item xs={4} sm={4} md={3}>
              <Card onClick={() => openGame(item.game_id)}>
                <Box padding={1}>
                  <Image
                    width={200}
                    height={200}
                    src={`${item.img_path}`}
                    alt={item.game_name}
                  />
                </Box>
                <Typography padding={1}>{item.title}</Typography>
              </Card>
            </Grid>
          ))}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Container
              sx={style}
            >  
              <iframe src={iframeUrl} title="Modal iframe" width={'100%'} height={600} /> 
            </Container>
          </Modal>
        </Grid>
      </Box>
    </Modals>
  );
};

export default GamesModal;
