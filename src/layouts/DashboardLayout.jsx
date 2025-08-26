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
  <Paper sx={{ p: 2, height: "100%" }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography variant="subtitle1" color="info.main">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" component="p">
      {value}
    </Typography>
    {subValue && (
      <Typography variant="body2" color="text.secondary">
        {subValue}
      </Typography>
    )}
  </Paper>
);

// リスト形式のカードのヘッダー部分を共通化したコンポーネント
const ListCardHeader = ({ title, to }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 1,
    }}
  >
    <Typography variant="subtitle1" color="info.main">
      {title}
    </Typography>
    <IconButton component={RouterLink} to={to} sx={{ p: 0 }}>
      <ArrowCircleRightIcon />
    </IconButton>
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
            <Paper sx={{ p: 2, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0,
                }}
              >
                <Grid container spacing={8} alignItems="top">
                  <Grid size={6}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" color="info.main">
                        現在レート
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="p">
                      {currentRate}
                    </Typography>
                  </Grid>
                  <Grid size={6}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" color="info.main">
                        最高レート
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="p">
                      {peakRateData?.rateAfter}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
            <Paper sx={{ p: 2 }}>
              <ListCardHeader title="直近5レース" to="/summary/daily" />
              <List dense>
                {recent5Races.map((race) => (
                  <ListItem
                    key={race.id}
                    disableGutters
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" noWrap sx={{ mr: 1 }}>
                      {race.course}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {race.rank}位
                      </Typography>
                      <RateChange
                        value={race.rateChange}
                        isFixed={false}
                        sx={rateSx}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid sx={{ display: { xs: "none", md: "block" } }}>
            <Paper sx={{ p: 2 }}>
              <ListCardHeader title="コース BEST5" to="/summary/course" />
              <List dense>
                {得意コース.map((c) => (
                  <ListItem
                    key={c.courseName}
                    disableGutters
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" noWrap sx={{ mr: 1 }}>
                      {c.courseName}
                    </Typography>
                    <RateChange value={c.all.avgRateChange} sx={rateSx} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid sx={{ display: { xs: "none", md: "block" } }}>
            <Paper sx={{ p: 2 }}>
              <ListCardHeader
                title="コース WORST5"
                to="/summary/course?order=asc"
              />
              <List dense>
                {苦手コース.map((c) => (
                  <ListItem
                    key={c.courseName}
                    disableGutters
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" noWrap sx={{ mr: 1 }}>
                      {c.courseName}
                    </Typography>
                    <RateChange value={c.all.avgRateChange} sx={rateSx} />
                  </ListItem>
                ))}
              </List>
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
