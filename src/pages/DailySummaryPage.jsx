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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RaceTable from "../components/RaceTable";
import RateChange from "../components/RateChange";
import raceData from "../dummyRaces.json";
import { summarizeByDate } from "../utils/utils";
import StyledTable from "../components/StyledTable";

// 一日ごとの行コンポーネント
function DailyRow({ day, open, setOpen }) {
  // 【新規】レースデータを左右のカラムに分割するロジック
  const splitRaces = useMemo(() => {
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
  }, [day.races]);

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell sx={{ width: "10px" }}>
          <IconButton
            size="small"
            onClick={() => setOpen(open ? null : day.date)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontSize: "1.4rem" }}>{day.date}</TableCell>
        <TableCell
          align="right"
          style={{ padding: "18px 12px" }}
          sx={{ fontSize: "1.4rem" }}
        >
          {day.raceCount}戦
        </TableCell>
        <TableCell align="right" sx={{ fontSize: "1.4rem" }}>
          {day.avgRank.toFixed(2)}位
        </TableCell>
        <TableCell align="right" sx={{ fontSize: "1.4rem" }}>
          {day.startRate}
        </TableCell>
        <TableCell align="right" sx={{ fontSize: "1.4rem" }}>
          {day.endRate}
        </TableCell>
        <TableCell
          align="left"
          sx={{ fontSize: "1.4rem" }}
          style={{ padding: "0px 12px 0px 0px" }}
        >
          <RateChange value={day.rateChange} isFixed={false} size={"1.1rem"} />
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

  return (
    <TableContainer component={Paper} sx={{ padding: 0 }}>
      <StyledTable aria-label="日別戦績テーブル">
        <colgroup>
          <col style={{ width: "5px" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "3%" }} />
        </colgroup>
        <TableHead>
          <TableRow sx={{ backgroundColor: "background.paper" }}>
            <TableCell />
            <TableCell sx={{ fontSize: "1.1rem" }}>日付</TableCell>
            <TableCell sx={{ fontSize: "1.1rem" }} align="right">
              試合数
            </TableCell>
            <TableCell sx={{ fontSize: "1.1rem" }} align="right">
              平均順位
            </TableCell>
            <TableCell sx={{ fontSize: "1.1rem" }} align="right">
              開始レート
            </TableCell>
            <TableCell sx={{ fontSize: "1.1rem" }} align="right" colSpan={2}>
              終了レート
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
            />
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default DailySummaryPage;
