import {
  Box,
  Button,
  Container,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Switch,
  Typography,
  keyframes,
  styled,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import {
  AccountCircle as User,
  CurrencyBitcoinRounded as Currency,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import TransactionModal from "@/modules/Transactions/TransactionModal";
import { useModal } from "@/utils/hooks";
import { useUserInfoQuery } from "@/services/gamesService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { isSubmitTransaction as isSubmitTransactionAction } from "@/app/slices/commonSlices";
const Headers = ({
  onSetLanguage,
  onSetDarkMode,
  isDarkMode,
  language,
}: any) => {
  const theme = useTheme();
  const [navLink, setNavLink] = useState("");
  const router = useRouter();
  const [type, setType] = useState("");
  const { isSubmitTransaction } = useSelector(
    (state: RootState) => state.common
  );
  const dispatch = useDispatch();
  const user = localStorage.getItem("user") || "";
  let parseUser;
  if (user) {
    parseUser = JSON.parse(user || "");
  }

  const { data, refetch } = useUserInfoQuery(
    { id: parseUser?.id || null },
    { skip: !parseUser?.id }
  );

  useEffect(() => {
    if (isSubmitTransaction) {
      refetch().then(() => {
        return dispatch(isSubmitTransactionAction(false));
      });
    }
  }, [isSubmitTransaction]);

  useEffect(() => {
    setNavLink(router.pathname);
  }, [router]);

  const handleChangeLanguage = (e: any) => {
    const language = e.target.value as string;
    localStorage.setItem("language", language);
    onSetLanguage(language);
  };

  const handleChangeMode = () => {
    onSetDarkMode(() => (isDarkMode === "dark" ? "light" : "dark"));
    localStorage.setItem("theme", isDarkMode === "dark" ? "light" : "dark");
  };

  const handleRedirectChat = () => {};
  const { hide, show, visible } = useModal();
  const redirectLinkMemo = useMemo(() => {
    const isHaveToken = !!localStorage.getItem("tokens");
    if (isHaveToken) {
      return "/games";
    }
    return "/login";
  }, []);

  const onOpenModal = (type: string) => {
    show();
    setType(type);
  };

  const navLinkMemo = useMemo(() => {
    const isHaveToken = !!localStorage.getItem("tokens");
    return isHaveToken ? (
      <NavList className="flex justify-center items-center">
        <ListItem className={`w-full ${navLink === "/games" ? "active" : ""}`}>
          <Link href="/games">
            <FormattedMessage id="label.games" />
          </Link>
        </ListItem>
        <ListItem
          className={`w-full whitespace-nowrap ${
            navLink === "/transactions" ? "active" : ""
          }`}
        >
          <Link href="/transactions">
            <FormattedMessage id="label.history" />
          </Link>
        </ListItem>
        <ListItem className="w-full whitespace-nowrap">
          <Link
            href={`${
              process.env.NEXT_PUBLIC_CHAT_URL
            }?token=${localStorage.getItem(
              "tokens"
            )}&user=${localStorage.getItem("user")}`}
            onClick={handleRedirectChat}
            target="_blank"
          >
            <FormattedMessage id="label.contacts" />
          </Link>
        </ListItem>
        <ListItem className="w-full whitespace-nowrap">
          <Button onClick={() => onOpenModal("deposit")}>Deposit</Button>
        </ListItem>
        <ListItem className="w-full whitespace-nowrap">
          <Button onClick={() => onOpenModal("withdraw")}>WithDraw</Button>
        </ListItem>
      </NavList>
    ) : (
      <div></div>
    );
  }, [navLink]);

  const username = useMemo(() => {
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      return JSON.parse(userLocal)?.name;
    }
    return "";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    router.push("/login");
  };

  const userSettingMemo = useMemo(() => {
    const userLocal = localStorage.getItem("tokens");
    if (userLocal) {
      return (
        <Box
          width="240px"
          position="relative"
          sx={{
            cursor: "pointer",
            "&:hover": {
              ".user-setting": {
                display: "block",
              },
            },
          }}
        >
          <Box display="flex" alignItems="center" gap="4px">
            <Box display="flex" alignItems="center" gap="4px">
              <Currency color="primary" sx={{ color: "#ffba00a6" }} />
              <Typography width="max-content" whiteSpace="nowrap">
                {data?.data?.balance}
              </Typography>
            </Box>
            <Typography
              maxWidth="120px"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {username}
            </Typography>
            <User />
          </Box>
          <UserSetting
            position="absolute"
            display="none"
            className="user-setting"
            bgcolor={theme.palette.text.secondary}
            width="100%"
            left="0"
          >
            <List>
              <ListItem
                sx={{ justifyContent: "flex-end", padding: "0 8px" }}
                onClick={handleLogout}
              >
                <Typography color="color.contrastText">Logout</Typography>
              </ListItem>
            </List>
          </UserSetting>
        </Box>
      );
    }
  }, [theme, username, data]);

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
        <Link href={redirectLinkMemo}>
          <Typography
            whiteSpace="nowrap"
            fontWeight={600}
            fontSize={24}
            letterSpacing={2}
            textTransform="uppercase"
            sx={{ cursor: "pointer" }}
          >
            Best Pick
          </Typography>
        </Link>

        <Box>{navLinkMemo}</Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={0.5}
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
          <Box>
            <SelectLanguage
              value={language}
              label="Language"
              onChange={handleChangeLanguage}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ko">Korean</MenuItem>
            </SelectLanguage>
          </Box>
          {userSettingMemo}
        </Box>

        <TransactionModal
          actionType={type}
          open={visible}
          onClose={hide}
          refetch={() => console.log(123)}
        />
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

const NavList = styled(List)(({ theme }) => ({
  li: {
    a: {
      borderBottom: "2px solid transparent",
    },
    "&.active": {
      "a, button": {
        borderBottom: "2px solid #ccc",
        fontWeight: "600",
      },
    },
  },
}));

const SelectLanguage = styled(Select)({
  width: "100px",
  fieldset: {
    border: "none",
  },
});

const spin = keyframes`
   from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

const UserSetting = styled(Box)({
  cursor: "pointer",
  transformOrigin: "top right",
  animation: `${spin} ease-in 0.2s`,
  borderRadius: "2px",
  top: "calc(100% + 8px)",
  "&::before": {
    content: '""',
    width: "100%",
    height: "20px",
    position: "absolute",
    left: "0",
    top: "-12px",
    background: "transparent",
  },
  ul: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    li: {
      padding: "4px 8px",
      transition: " opacity 0.2s ease,  background 0.2s ease, color 0.3s ease",
      "&:hover": {
        opacity: 0.8,
        background: "#828282",
        color: "#fff",
      },
    },
  },
});
