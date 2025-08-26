import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RaceTable from "../components/RaceTable";
import RateChange from "../components/RateChange";
import raceData from "../dummyRaces.json";
import { summarizeByDate } from "../utils/utils";
import StyledTable from "../components/StyledTable";

const rootHeaderSx = {
  padding: { xs: "6px 6px", sm: "10px 10px" },
  fontSize: { xs: "0.7rem", sm: "0.9rem", md: "1.0rem" },
};

const rootBodySx = {
  padding: { xs: "12px 4px", sm: "16px 12px" },
  fontSize: { xs: "0.8rem", sm: "1.0rem", md: "1.1rem" },
};

const rootRateSx = {
  padding: { xs: "0px 6px 0px 0px", sm: "0px 10px 0px 0px" },
  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1.0rem" },
};

// 一日ごとの行コンポーネント
function DailyRow({ day, open, setOpen, isMobile }) {
  // 【新規】レースデータを左右のカラムに分割するロジック
  const splitRaces = useMemo(() => {
    if (isMobile) {
      return null; // スマホの時は、分割不要
    }
    // まず、全レースを最新順にソートする
    const sorted = [...day.races].sort((a, b) => b.id - a.id);

    const left = [];
    const right = [];

    // 順番に、左、右、左、右...と振り分けていく
    sorted.forEach((race, index) => {
      if (index % 2 === 0) {
        left.push(race);
      } else {
        right.push(race);
      }
    });

    return { left, right };
  }, [day.races, isMobile]);

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell sx={{ padding: { xs: "0px 0px", sm: "6px 6px" } }}>
          <IconButton
            size="small"
            onClick={() => setOpen(open ? null : day.date)}
          >
            {open ? (
              <KeyboardArrowUpIcon fontSize="inherit" />
            ) : (
              <KeyboardArrowDownIcon fontSize="inherit" />
            )}
          </IconButton>
        </TableCell>
        <TableCell sx={rootBodySx}>{day.date}</TableCell>
        <TableCell align="right" sx={rootBodySx}>
          {day.raceCount}戦
        </TableCell>
        <TableCell align="right" sx={rootBodySx}>
          {day.avgRank.toFixed(2)}位
        </TableCell>
        <TableCell align="right" sx={rootBodySx}>
          {day.startRate}
        </TableCell>
        <TableCell align="right" sx={rootBodySx}>
          {day.endRate}
        </TableCell>
        <TableCell align="left" sx={rootRateSx}>
          <RateChange value={day.rateChange} isFixed={false} sx={rootRateSx} />
        </TableCell>
      </TableRow>

      <TableRow style={{ padding: 0 }}>
        <TableCell style={{ padding: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 0,
                padding: 0,
              }}
            >
              {isMobile ? (
                <Box borderLeft={5} borderColor={"info.main"}>
                  <RaceTable races={day.races} />
                </Box>
              ) : (
                <Grid container spacing={0}>
                  <Grid size={{ xs: 0, md: 1.0 }} />
                  <Grid
                    size={{ xs: 12, md: 5.5 }}
                    spacing={0}
                    borderLeft={5}
                    borderColor={"info.main"}
                  >
                    <RaceTable races={splitRaces.left} />
                  </Grid>
                  <Grid
                    size={{ xs: 12, md: 5.5 }}
                    spacing={0}
                    borderLeft={5}
                    borderColor={"info.main"}
                  >
                    <RaceTable races={splitRaces.right} />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const DailySummaryPage = () => {
  const dailySummary = useMemo(() => summarizeByDate(raceData), []);
  const [openDate, setOpenDate] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <TableContainer component={Paper} sx={{ padding: 0 }}>
      <StyledTable aria-label="日別戦績テーブル">
        <colgroup>
          <col style={{ width: "4%" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "2%" }} />
        </colgroup>
        <TableHead>
          <TableRow sx={{ backgroundColor: "background.paper" }}>
            <TableCell />
            <TableCell sx={rootHeaderSx}>日付</TableCell>
            <TableCell sx={rootHeaderSx} align="right">
              {isMobile ? "レース" : "レース数"}
            </TableCell>
            <TableCell sx={rootHeaderSx} align="right">
              {isMobile ? "順位" : "平均順位"}
            </TableCell>
            <TableCell sx={rootHeaderSx} align="right">
              {isMobile ? "開始" : "開始レート"}
            </TableCell>
            <TableCell sx={rootHeaderSx} align="center" colSpan={2}>
              {isMobile ? "終了" : "終了レート"}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dailySummary.map((day) => (
            <DailyRow
              key={day.date}
              day={day}
              open={openDate === day.date}
              setOpen={setOpenDate}
              isMobile={isMobile}
            />
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default DailySummaryPage;
