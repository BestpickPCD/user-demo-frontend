import {
  useGetGameListMutation,
  useGetGamesQuery,
} from "@/services/gamesService";
import { useModal } from "@/utils/hooks";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import GamesModal from "./GamesModal";
import Image from "next/image";
import { icons, imgs } from "../../../public";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  borderRadius: 4,
  overflow: "hidden",
}));

const Games = () => {
  const { data } = useGetGamesQuery();
  const [getGameList] = useGetGameListMutation();
  const { visible, toggle } = useModal();
  const [directUrl, setDirectUrl] = useState(false)
  const [gameList, setGameList] = useState<any[]>([]); 
  const listGames = async (vendors: string | undefined) => {
    const data = await getGameList({ vendors }).unwrap();
    return data;
  };

  const onClickGame = async (item: any) => {
    const list = await listGames(item.name); 
    setDirectUrl(item.directUrl)
    setGameList(list);
    toggle();
  };

  return (
    <>
      <Container sx={{ marginTop: 10 }}>
        <Typography>GAMES</Typography>
        {data?.data?.data.length} game companies.
        <Box marginY={3}>
          <Grid container columns={{ xs: 8, sm: 12, md: 16, lg: 20 }}>
            {data?.data?.data.map((item, index) => (
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                lg={4}
                height="300px"
                marginY={1}
                padding={1}
                key={`${item.img}-${index}`}
              >
                <Box>
                  <div className="card">
                    <div className="wrapper">
                      <Image
                        src={imgs.greyBackground}
                        alt={item.name}
                        className="cover-image"
                      />
                    </div>
                    <Typography className="character">{item.name}</Typography> 
                    <Typography className="title">{item.name}</Typography>
                    <Box>
                      <Box
                        paddingBottom="10px"
                        className="container"
                        onClick={() => onClickGame(item)}
                      >
                        <p className="button-detail">View Detail</p>
                      </Box>
                    </Box>
                  </div>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      {gameList?.length && (
        <GamesModal 
          directUrl={directUrl}
          visible={visible}
          toggle={toggle}
          data={gameList}
          title={<Box display="flex"></Box>}
        />
      )}
    </>
  );
};

export default Games;
