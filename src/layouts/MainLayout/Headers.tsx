import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import Link from "next/link";
const Headers = ({
  onSetLanguage,
  onSetDarkMode,
  isDarkMode,
  language,
}: any) => {
  const theme = useTheme();
  const handleChangeLanguage = (e: SelectChangeEvent) => {
    const language = e.target.value as string;
    localStorage.setItem("language", language);
    onSetLanguage(language);
  };

  const handleChangeMode = () => {
    onSetDarkMode(() => (isDarkMode === "dark" ? "light" : "dark"));
    localStorage.setItem("theme", isDarkMode === "dark" ? "light" : "dark");
  };

  return (
    <Box
      sx={{ background: theme.palette.background.default }}
      position="fixed"
      width="100%"
      zIndex={100}
      top={0}
      left={0}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80px",
        }}
      >
        <Link href="/">
          <Typography
            fontWeight={600}
            fontSize={24}
            letterSpacing={2}
            textTransform="uppercase"
          >
            Best Pick
          </Typography>
        </Link>

        <Box>
          <List className="flex justify-center items-center">
            <ListItem className="w-full">
              <Link href="/games">Games</Link>
            </ListItem>
            <ListItem className="w-full whitespace-nowrap">
              <Link href="/transactions">Betting History</Link>
            </ListItem>
          </List>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <FormControlLabel
            sx={{ margin: 0 }}
            control={
              <MaterialUISwitch
                checked={isDarkMode === "dark" ? true : false}
                onChange={handleChangeMode}
              />
            }
            label={undefined}
          />
          <Box sx={{ minWidth: 150 }}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={handleChangeLanguage}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ko">Korean</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Headers;
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 80,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(24px)",
    right: "0 !important",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(-24px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url(/icons/darkMode.svg)`,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#89b7cc" : "#e0ebf0",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url(/icons/lightMode.svg)`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#52569b !important"
        : "#bfd3d6 !important",
    borderRadius: 20 / 2,
  },
}));
