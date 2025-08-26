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
  useMediaQuery,
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

const rootHeaderSx = {
  padding: { xs: "6px 6px", sm: "6px 10px" },
  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.0rem" },
};

const rootBodySx = {
  padding: { xs: "12px 2px", sm: "16px 16px" },
  fontSize: { xs: "0.8rem", sm: "1.0rem", md: "1.1rem" },
};

const childHeaderSx = {
  padding: { xs: "6px 10px", sm: "6px 10px" },
  fontSize: { xs: "0.6rem", sm: "0.8rem", md: "0.9rem" },
};

const childBodySx = {
  padding: { xs: "6px 6px", sm: "6px 10px" },
  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.0rem" },
};

const CourseResultTable = ({ courses, isMobile }) => {
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
              <TableCell sx={childHeaderSx} align="right">
                {isMobile ? "レース" : "レース数"}
              </TableCell>
              <TableCell sx={childHeaderSx} align="right">
                平均順位
              </TableCell>
              <TableCell sx={childHeaderSx} align="right">
                平均レート
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.courseName} hover>
                <TableCell sx={childBodySx}>{course.courseName}</TableCell>
                <TableCell align="right" sx={childBodySx}>
                  {course.all.raceCount}戦
                </TableCell>
                <TableCell align="right" sx={childBodySx}>
                  {course.all.avgRank.toFixed(2)}位
                </TableCell>
                <TableCell sx={childBodySx} align="right">
                  <RateChange
                    value={course.all.avgRateChange}
                    sx={childBodySx}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

function DailyRow({ day, isOpen, onToggle, isMobile }) {
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
        <TableCell sx={{ padding: { xs: "0px 0px", sm: "6px 6px" } }}>
          <IconButton size="small" onClick={onToggle}>
            {isOpen ? (
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
          <RateChange value={day.rateChange} isFixed={false} sx={rootBodySx} />
        </TableCell>
        <TableCell align="right" sx={rootBodySx}>
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
                  <CourseResultTable
                    courses={positiveCourses}
                    isMobile={isMobile}
                  />
                </Grid>
                <Grid
                  size={{ xs: 12, md: 5.75 }}
                  spacing={0}
                  borderLeft={5}
                  borderColor={"error.secondary"}
                >
                  <CourseResultTable
                    courses={negativeCourses}
                    isMobile={isMobile}
                  />
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
      <RateChart races={chartData} />

      <TableContainer component={Paper} sx={{ padding: 0 }}>
        <StyledTable aria-label="日別戦績テーブル">
          <colgroup>
            <col style={{ width: "2%" }} />
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
              <TableCell sx={rootHeaderSx} align="right">
                {isMobile ? "増減" : "増減レート"}
              </TableCell>
              <TableCell sx={rootHeaderSx} align="right">
                {isMobile ? "終了" : "終了レート"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dailySummary.map((day) => (
              <DailyRow
                key={day.date}
                day={day}
                isOpen={openRowDate === day.date}
                isMobile={isMobile}
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
