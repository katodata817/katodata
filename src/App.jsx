import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
} from "@mui/material";
import Header from "./components/Header";
import DashboardLayout from "./layouts/DashboardLayout";
import TopPage from "./pages/TopPage";
import DailySummaryPage from "./pages/DailySummaryPage";
import CourseSummaryPage from "./pages/CourseSummaryPage";
import ScrollToTop from "./components/ScrollToTop";
import OtherDataPage from "./pages/OtherDataPage";

const shades = {
  primary: {
    100: "#cccccc",
    200: "#999999",
    300: "#666666",
    400: "#333333",
    500: "#000000",
    600: "#000000",
  },

  secondary: {
    100: "#f7ccd2",
    200: "#ef99a4",
    300: "#e66677",
    400: "#de3349",
    500: "#d6001c",
    600: "#ab0016",
    700: "#800011",
    800: "#56000b",
    900: "#2b0006",
  },
  neutral: {
    100: "#f5f5f5",
    200: "#ecebeb",
    300: "#e2e1e1",
    400: "#d9d7d7",
    500: "#cfcdcd",
    600: "#a6a4a4",
  },
  success: {
    100: "#52EEA0",
    200: "#23EA87",
    300: "#28EB89",
    400: "#13CD70",
    500: "#0ea058",
    600: "#a6a4a4",
  },
  error: {
    100: "#FB8D8F",
    200: "#F95B5E",
    300: "#FA5F62",
    400: "#F92E31",
    500: "#f30508",
    600: "#a6a4a4",
  },
};

const customDarkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#121c35",
      light: "#0a4568",
      dark: "#0D1425",
    },
    background: {
      default: "#0D1425",
      paper: "#121c35",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bbbbbb",
    },
    info: {
      main: "#cb9c39",
      secondary: "#a63b26",
    },
    success: {
      main: shades.success[500],
      secondary: shades.success[100],
    },
    error: {
      main: shades.error[500],
      secondary: shades.error[100],
    },
    divider: "#666666",
  },
});

function App() {
  return (
    <ThemeProvider theme={customDarkTheme}>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <Container sx={{ my: 4, flexGrow: 1 }} maxWidth="xl">
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<TopPage />} />
                <Route path="/summary/daily" element={<DailySummaryPage />} />
                <Route path="/summary/course" element={<CourseSummaryPage />} />
                <Route path="other" element={<OtherDataPage />} />
              </Route>
            </Routes>
          </Container>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
