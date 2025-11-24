import React, { useMemo } from "react";
import { Outlet } from "react-router-dom"; // ← Outletをインポート
import {
  Grid,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import raceData from "../dummyRaces.json";
import { summarizeByCourse } from "../utils/utils";
import RateChange from "../components/RateChange";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const rateSx = {
  fontSize: "1.0rem",
};

const SummaryCard = ({ title, value, subValue }) => (
  <Paper sx={{ p: 0, height: "100%" }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 0,
      }}
    >
      <Typography
        variant="subtitle1"
        color="info.main"
        sx={{
          fontWeight: "bold",
          px: 2,
          py: 1,
        }}
      >
        {title}
      </Typography>
    </Box>
    <Paper sx={{ px: 2, pb: 1 }}>
      <Typography variant="h4" component="p">
        {value}
      </Typography>
      {subValue && (
        <Typography variant="body2" color="text.secondary">
          {subValue}
        </Typography>
      )}
    </Paper>
  </Paper>
);

// リスト形式のカードのヘッダー部分を共通化したコンポーネント
const ListCardHeader = ({ title, to }) => (
  <Box
    component={RouterLink}
    to={to}
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      px: 2,
      py: 1,
      backgroundColor: "action.hover",
      "&:hover": {
        bgcolor: "action.selected",
      },
    }}
  >
    <Typography
      variant="subtitle1"
      color="info.main"
      sx={{
        // fontSize: "1.2rem",
        fontWeight: "bold",
      }}
    >
      {title}
    </Typography>
    <ArrowForwardIcon sx={{ color: "#ffffff" }} />
    {/* <IconButton component={RouterLink} sx={{ p: 0 }}>

    </IconButton> */}
  </Box>
);

const DashboardLayout = () => {
  // --- サブカラム用のデータ計算 ---
  const courseSummary = useMemo(() => summarizeByCourse(raceData), []);
  const currentRate =
    raceData.length > 0 ? raceData[raceData.length - 1].rateAfter : "N/A";
  const peakRateData = useMemo(
    () =>
      raceData.length > 0
        ? raceData.reduce(
            (max, race) => (race.rateAfter > max.rateAfter ? race : max),
            raceData[0]
          )
        : null,
    []
  );
  const firstDate = raceData.length > 0 ? raceData[0].date : null;
  const lastDate =
    raceData.length > 0 ? raceData[raceData.length - 1].date : null;

  const recent5Races = useMemo(() => raceData.slice(-5).reverse(), []);

  const 得意コース = useMemo(
    () =>
      [...courseSummary]
        .sort((a, b) => b.all.avgRateChange - a.all.avgRateChange)
        .slice(0, 5),
    [courseSummary]
  );
  const 苦手コース = useMemo(
    () =>
      [...courseSummary]
        .sort((a, b) => a.all.avgRateChange - b.all.avgRateChange)
        .slice(0, 5),
    [courseSummary]
  );

  const PIE_COLORS = ["#0088FE", "#FF8042"];

  return (
    <Grid container spacing={3}>
      {/* 左カラム (常に表示される) */}
      <Grid size={{ xs: 12, md: 2.5 }}>
        <Grid container spacing={3} direction="column">
          {/* ↓↓↓【変更点1】現在/最高レートを1枚に統合 ↓↓↓ */}
          <Grid sx={{ display: { xs: "none", md: "block" } }}>
            <Paper sx={{ p: 0, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0,
                }}
              >
                <Grid container spacing={4} alignItems="top">
                  <Grid size={6}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="info.main"
                        sx={{
                          fontWeight: "bold",
                          px: 2,
                          py: 1,
                        }}
                      >
                        現在レート
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="p" sx={{ px: 2 }}>
                      {currentRate}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ px: 2, pb: 1 }}
                    >
                      {lastDate ? `${lastDate}` : ""}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="info.main"
                        sx={{
                          fontWeight: "bold",
                          px: 2,
                          py: 1,
                        }}
                      >
                        最高レート
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="p" sx={{ px: 2 }}>
                      {peakRateData?.rateAfter}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ px: 2 }}
                    >
                      {peakRateData ? `${peakRateData.date}` : ""}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid sx={{ display: { xs: "none", md: "block" } }}>
            <SummaryCard
              title="総レース数"
              value={`${raceData.length} 戦`}
              subValue={
                firstDate && lastDate ? `${firstDate} ~ ${lastDate}` : ""
              }
            />
          </Grid>

          <Grid sx={{ display: { xs: "none", md: "block" } }}>
            <Paper sx={{ p: 0 }}>
              <ListCardHeader title="得意コース" to="/summary/course" />
              <Paper sx={{ px: 2 }}>
                <List dense>
                  {得意コース.map((c) => (
                    <ListItem
                      key={c.courseName}
                      disableGutters
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography noWrap sx={{ mr: 1, fontSize: "1.0rem" }}>
                        {c.courseName}
                      </Typography>
                      <RateChange value={c.all.avgRateChange} sx={rateSx} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Paper>
          </Grid>

          <Grid sx={{ display: { xs: "none", md: "block" } }}>
            <Paper sx={{ p: 0 }}>
              <ListCardHeader
                title="苦手コース"
                to="/summary/course?order=asc"
              />
              <Paper sx={{ px: 2 }}>
                <List dense>
                  {苦手コース.map((c) => (
                    <ListItem
                      key={c.courseName}
                      disableGutters
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography noWrap sx={{ mr: 1, fontSize: "1.0rem" }}>
                        {c.courseName}
                      </Typography>
                      <RateChange value={c.all.avgRateChange} sx={rateSx} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Paper>
          </Grid>

          <Grid sx={{ display: { xs: "none", md: "block" } }}>
            <Paper sx={{ p: 0 }}>
              <ListCardHeader title="レース履歴" to="/summary/daily" />
              <Paper sx={{ px: 2 }}>
                <List dense>
                  {recent5Races.map((race) => (
                    <ListItem
                      key={race.id}
                      disableGutters
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography noWrap sx={{ mr: 1, fontSize: "1.0rem" }}>
                        {race.course}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Typography sx={{ fontSize: "1.0rem" }}>
                          {race.rank}位
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Grid>

      {/* 右カラム (URLに応じて中身が変わる) */}
      <Grid size={{ xs: 12, md: 9.5 }}>
        {/* ↓↓↓ ここに、子ページのコンポーネントが描画される ↓↓↓ */}
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default DashboardLayout;
