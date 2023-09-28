import { store } from "@/app/store";
import createEmotionCache from "@/createEmotionCache";
import { default as enLanguage } from "@/locales/en.json";
import { default as koLanguage } from "@/locales/ko.json";
import "@/styles/global.css";
import { darkModeTheme, lightModeTheme } from "@/theme";
import { CacheProvider, EmotionCache, ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const clientSideEmotionCache = createEmotionCache();
export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
const messages = {
  en: enLanguage,
  ko: koLanguage,
};

function MyApp(props: MyAppProps) {
  const router = useRouter();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [language, setLanguage] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<string>();

  useEffect(() => {
    const language = localStorage.getItem("language");
    if (language) {
      return setLanguage(language);
    }
    localStorage.setItem("language", "en");
    return setLanguage("en");
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme && (theme === "dark" || theme === "light")) {
      return setIsDarkMode(() => (theme === "dark" ? "dark" : "light"));
    }
    localStorage.setItem("theme", "dark");
    return setIsDarkMode("dark");
  }, []);

  useEffect(() => {
    if (router.pathname === "/_error") {
      router.push("/login");
    }
  }, []);
  return (
    <Provider store={store}>
      <IntlProvider locale="en" messages={(messages as any)[language || "en"]}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          {(isDarkMode === "light" || isDarkMode === "dark") && (
            <ThemeProvider
              theme={isDarkMode === "light" ? lightModeTheme : darkModeTheme}
            >
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <CssBaseline />
                <Component
                  {...pageProps}
                  language={language}
                  isDarkMode={isDarkMode}
                  onSetLanguage={setLanguage}
                  onSetDarkMode={setIsDarkMode}
                />
              </LocalizationProvider>
              <ToastContainer />
            </ThemeProvider>
          )}
        </CacheProvider>
      </IntlProvider>
    </Provider>
  );
}
export default MyApp;
