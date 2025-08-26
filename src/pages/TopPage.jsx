import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RateChart from "../components/RateChart";
import RaceTable from "../components/RaceTable";
import RateChange from "../components/RateChange";
import raceData from "../dummyRaces.json";
import { summarizeByDate } from "../utils/utils"; // ← 新しい関数をインポート
import { summarizeByCourse } from "../utils/utils";
import StyledTable from "../components/StyledTable";

const largeSx = {
  padding: { xs: "12px 2px", sm: "16px 16px" },
  fontSize: { xs: "0.8rem", sm: "1.0rem", md: "1.1rem" },
};
const mediumSx = {
  padding: { xs: "6px 6px", sm: "6px 10px" },
  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.0rem" },
};
const smallSx = {
  padding: { xs: "6px 10px", sm: "6px 10px" },
  fontSize: { xs: "0.6rem", sm: "0.8rem", md: "0.9rem" },
};

const CourseResultTable = ({ courses }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        height: "100%",
        backgroundColor: "action.hover",
      }}
    >
      <TableContainer>
        <Table size="small">
          <colgroup>
            <col style={{ width: "auto" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <TableHead>
            <TableRow style={{ backgroundColor: theme.palette.action.hover }}>
              <TableCell></TableCell>
              <TableCell sx={smallSx} align="right">
                レース数
              </TableCell>
              <TableCell sx={smallSx} align="right">
                平均順位
              </TableCell>
              <TableCell sx={smallSx} align="right">
                平均レート
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.courseName} hover>
                <TableCell sx={mediumSx}>{course.courseName}</TableCell>
                <TableCell align="right" sx={mediumSx}>
                  {course.all.raceCount}戦
                </TableCell>
                <TableCell align="right" sx={mediumSx}>
                  {course.all.avgRank.toFixed(2)}位
                </TableCell>
                <TableCell sx={mediumSx} align="right">
                  <RateChange value={course.all.avgRateChange} sx={mediumSx} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

function DailyRow({ day, isOpen, onToggle }) {
  // この日に行われたレースデータ（day.races）を元に、コース別の成績を計算する
  const courseSummaryForDay = useMemo(
    () =>
      summarizeByCourse(day.races).sort(
        (a, b) => b.all.avgRateChange - a.all.avgRateChange
      ),
    [day.races]
  );

  // ↓↓↓ レートの増減で、勝ちコースと負けコースに分割 ↓↓↓
  const positiveCourses = courseSummaryForDay.filter(
    (c) => c.all.avgRateChange > 0
  );
  const negativeCourses = courseSummaryForDay.filter(
    (c) => c.all.avgRateChange <= 0
  );

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell sx={{ width: "10px" }}>
          <IconButton size="small" onClick={onToggle}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={largeSx}>{day.date}</TableCell>
        <TableCell align="right" sx={largeSx}>
          {day.raceCount}戦
        </TableCell>
        <TableCell align="right" sx={largeSx}>
          {day.avgRank.toFixed(2)}位
        </TableCell>
        <TableCell align="right" sx={largeSx}>
          {day.startRate}
        </TableCell>
        <TableCell align="right">
          <RateChange value={day.rateChange} isFixed={false} sx={largeSx} />
        </TableCell>
        <TableCell align="right" sx={largeSx}>
          {day.endRate}
        </TableCell>
      </TableRow>

      <TableRow style={{ padding: 0 }}>
        <TableCell style={{ padding: 0 }} colSpan={8}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 0,
                padding: 0,
              }}
            >
              <Grid container spacing={0}>
                <Grid size={{ xs: 0, md: 0.5 }} />
                <Grid
                  size={{ xs: 12, md: 5.75 }}
                  spacing={0}
                  borderLeft={5}
                  borderColor={"success.secondary"}
                >
                  <CourseResultTable courses={positiveCourses} />
                </Grid>
                <Grid
                  size={{ xs: 12, md: 5.75 }}
                  spacing={0}
                  borderLeft={5}
                  borderColor={"error.secondary"}
                >
                  <CourseResultTable courses={negativeCourses} />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const TopPage = () => {
  const dailySummary = useMemo(() => summarizeByDate(raceData), []);
  const [openRowDate, setOpenRowDate] = useState(
    // ページを開いた時の初期値として、最新の日付（配列の最初の要素）を設定
    dailySummary.length > 0 ? dailySummary[0].date : null
  );

  // 開閉ボタンが押された時の処理
  const handleToggleRow = (date) => {
    // 今開いている行を、もう一度クリックしたら閉じる。違う行なら、そっちを開く。
    setOpenRowDate((prevOpenDate) => (prevOpenDate === date ? null : date));
  };

  // ↓↓↓【重要】グラフに表示するデータを、ここで決める ↓↓↓
  const chartData = useMemo(() => {
    // もし、開いている行があったら
    if (openRowDate) {
      // その日のレースデータだけを返す
      const selectedDay = dailySummary.find((day) => day.date === openRowDate);
      return selectedDay ? selectedDay.races : [];
    }
    // 開いている行がなかったら、全期間のデータを返す
    return raceData;
  }, [openRowDate, dailySummary]);

  return (
    <Box>
      <RateChart races={chartData} />

      <TableContainer component={Paper} sx={{ padding: 0 }}>
        <StyledTable aria-label="日別戦績テーブル">
          <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <TableHead>
            <TableRow sx={{ backgroundColor: "background.paper" }}>
              <TableCell />
              <TableCell sx={mediumSx}>日付</TableCell>
              <TableCell sx={mediumSx} align="right">
                レース数
              </TableCell>
              <TableCell sx={mediumSx} align="right">
                平均順位
              </TableCell>
              <TableCell sx={mediumSx} align="right">
                開始レート
              </TableCell>
              <TableCell sx={mediumSx} align="right">
                増減レート
              </TableCell>
              <TableCell sx={mediumSx} align="right">
                終了レート
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailySummary.map((day) => (
              <DailyRow
                key={day.date}
                day={day}
                isOpen={openRowDate === day.date}
                onToggle={() => handleToggleRow(day.date)}
              />
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Box>
  );
};

export default TopPage;
