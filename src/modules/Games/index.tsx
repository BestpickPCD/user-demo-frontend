import { useGetGamesQuery } from "@/services/gamesService";
import {
  Box,
  Card,
  Container,
  Grid,
  Paper,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { imgs } from "../../../public";
import { useModal } from "@/utils/hooks";
import GamesModal from "./GamesModal";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  borderRadius: 4,
  overflow: "hidden",
}));

const Games = () => {
  const { data } = useGetGamesQuery();
  const theme = useTheme();
  const { visible, toggle } = useModal();
  const [gameData, setGameData] = React.useState<any>();
  const onRender = (item: any) => {
    const set = new Set(
      item.fetchGames.map((fetchGameItem: any) => fetchGameItem.type)
    );
    const arr = Array.from(set) as string[];
    return arr.map((gameType, index) => (
      <Box
        key={index}
        width="max-content"
        paddingY={0.5}
        paddingX={1}
        borderRadius={1}
        bgcolor="color.text"
      >
        <Typography color="color.contrastText" fontSize={14}>
          {gameType.slice(0, 1).toUpperCase() + gameType.slice(1)}
        </Typography>
      </Box>
    ));
  };

  const onClickGame = (item: any) => {
    setGameData(item);
    toggle();
  };
  console.log(gameData);

  return (
    <>
      <Container sx={{ marginTop: 10 }}>
        <Typography>GAMES</Typography>
        {data?.data?.data[0].fetchGames.length} games are available from{" "}
        {data?.data?.data.length} game companies.
        <Box marginY={3}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 8, sm: 8, md: 12 }}
          >
            {data?.data?.data.map((item, index) => (
              <Grid item xs={4} sm={4} md={3} key={index}>
                <Item
                  onClick={() => onClickGame(item)}
                  sx={
                    {
                      boxShadow:"0px 1px 2px 0px rgba(255, 255, 255, 0.3), 1px 2px 4px 0px rgba(255, 255, 255, 0.3), 2px 4px 8px 0px rgba(255, 255, 255, 0.3), 2px 4px 16px 0px rgba(255, 255, 255, 0.3)",
                    }
                  }
                >
                  <Box
                    bgcolor={theme.palette.mode === "dark" ? "#fff" : "#b1b1b1"}
                    padding={1}
                  >
                    <Image src={imgs.vendorEvolution} alt={item.name} />
                  </Box>
                  <Box bgcolor="color.contrastText" padding={1}>
                    <Typography color="color.text" variant="h6" paddingY={1}>
                      {item.name.slice(0, 1).toUpperCase() + item.name.slice(1)}
                      {item.fetchGames.length}
                    </Typography>
                    <Box
                      display="flex"
                      gap={1}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      {onRender(item)}
                    </Box>
                  </Box>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <GamesModal
        visible={visible}
        toggle={toggle}
        data={gameData?.fetchGames}
        title={
          <Box display="flex">
            <Typography fontSize={18}>
              {gameData?.name?.slice(0, 1).toUpperCase() +
                gameData?.name?.slice(1)}
            </Typography>
            &nbsp;
            <Typography fontSize={18}>
              ({gameData?.fetchGames?.length})
            </Typography>
          </Box>
        }
      />
    </>
  );
};

export default Games;
