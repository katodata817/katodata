import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import raceData from "../dummyRaces.json";
import StyledTable from "../components/StyledTable";
import { summarizeByCourse } from "../utils/utils";
import RateChange from "../components/RateChange";
import { useTheme } from "@mui/material/styles";

function getNestedProperty(obj, path) {
  return path.split(".").reduce((o, p) => (o ? o[p] : undefined), obj);
}

function descendingComparator(a, b, orderBy) {
  const valA = getNestedProperty(a, orderBy) || 0;
  const valB = getNestedProperty(b, orderBy) || 0;
  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function CourseRow({ row, startDate, endDate, isAllTime }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const dailySummaryForCourse = useMemo(() => {
    const courseRaces = raceData.filter((race) => {
      if (race.course !== row.courseName) return false;
      // 「全期間」でなければ、ここでさらに日付で絞り込む
      if (!isAllTime) {
        const raceDate = new Date(race.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
          // 開始日と終了日が逆でもOK
          return raceDate >= end && raceDate <= start;
        }
        return raceDate >= start && raceDate <= end;
      }
      return true; // 全期間なら、コース名だけでOK
    });

    const statsByDate = courseRaces.reduce((acc, race) => {
      const { date, rateChange, type } = race;
      if (!acc[date]) {
        acc[date] = {
          all: { raceCount: 0, totalRateChange: 0 },
          road: { raceCount: 0, totalRateChange: 0 },
          circuit: { raceCount: 0, totalRateChange: 0 },
        };
      }
      const typeKey = type === "周回" ? "circuit" : "road";

      acc[date].all.raceCount++;
      acc[date].all.totalRateChange += rateChange;
      acc[date][typeKey].raceCount++;
      acc[date][typeKey].totalRateChange += rateChange;
      return acc;
    }, {});

    return Object.entries(statsByDate)
      .map(([date, data]) => {
        const calcAverages = (summary) =>
          summary.raceCount > 0
            ? {
                raceCount: summary.raceCount,
                avgRateChange: summary.totalRateChange / summary.raceCount,
              }
            : { raceCount: 0, avgRateChange: 0 };

        return {
          date,
          all: calcAverages(data.all),
          road: calcAverages(data.road),
          circuit: calcAverages(data.circuit),
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [row.courseName, startDate, endDate, isAllTime]);

  return (
    <React.Fragment>
      {/* 親テーブル */}
      <TableRow className="main-row">
        <TableCell align="right" sx={{ width: "4px" }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {row.courseName}
        </TableCell>

        <TableCell
          align="right"
          sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          {row.all.raceCount}戦
        </TableCell>
        <TableCell align="right">
          <RateChange
            value={row.all.avgRateChange}
            size={"1.2rem"}
            weight={"bold"}
          />
        </TableCell>

        <TableCell
          align="right"
          sx={{
            fontSize: "1.0rem",
            // backgroundColor: theme.palette.action.hover,
          }}
          className="left-solid"
        >
          {row.road.raceCount > 0 ? ` ${row.road.raceCount}戦` : "-"}
        </TableCell>
        <TableCell
          align="right"
          //   sx={{ backgroundColor: theme.palette.action.hover }}
        >
          <RateChange value={row.road.avgRateChange} size={"1.0rem"} />
        </TableCell>

        <TableCell
          align="right"
          sx={{
            fontSize: "1.0rem",
            // backgroundColor: theme.palette.action.hover,
          }}
          //   className="left-solid"
        >
          {row.circuit.raceCount > 0 ? `${row.circuit.raceCount}戦` : "-"}
        </TableCell>
        <TableCell
          align="right"
          //   sx={{ backgroundColor: theme.palette.action.hover }}
        >
          <RateChange value={row.circuit.avgRateChange} size={"1.0rem"} />
        </TableCell>
      </TableRow>

      {/* 子テーブル */}
      <TableRow className="collapse-row">
        <TableCell colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: "0px" }}>
              <Table
                size="small"
                sx={{
                  //   backgroundColor: "action.focus",
                  //   backgroundColor: "background.default",
                  "& .MuiTableRow-root:nth-of-type(even)": {
                    // backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <colgroup>
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "auto" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "13%" }} />
                </colgroup>
                <TableBody>
                  {dailySummaryForCourse.map((day, index) => (
                    <TableRow key={day.date} hover style={{ border: 0 }}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={dailySummaryForCourse.length}
                          sx={{
                            // 背景画像を指定
                            // backgroundImage: `url('/${encodeURIComponent(
                            //   row.courseName
                            // )}.png')`,
                            backgroundPosition: "center top",
                            border: 0,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "75%",
                          }}
                        />
                      )}
                      <TableCell
                        className="left-info"
                        style={{ padding: "8px 12px" }}
                        sx={{
                          fontSize: "1.0rem",
                          backgroundColor: theme.palette.action.hover,
                        }}
                      >
                        {day.date}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: "1.2rem",
                          backgroundColor: theme.palette.action.hover,
                        }}
                      >
                        {day.all.raceCount}戦
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ backgroundColor: theme.palette.action.hover }}
                      >
                        <RateChange
                          value={day.all.avgRateChange}
                          size={"1.2rem"}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        className="left-solid"
                        sx={{
                          fontSize: "1.0rem",
                          backgroundColor: theme.palette.action.hover,
                        }}
                      >
                        {day.road.raceCount > 0
                          ? `${day.road.raceCount}戦`
                          : "-"}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ backgroundColor: theme.palette.action.hover }}
                      >
                        {day.road.raceCount > 0 ? (
                          <RateChange
                            value={day.road.avgRateChange}
                            size={"1.0rem"}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell
                        align="right"
                        // className="left-solid"
                        sx={{
                          fontSize: "1.0rem",
                          backgroundColor: theme.palette.action.hover,
                        }}
                      >
                        {day.circuit.raceCount > 0
                          ? `${day.circuit.raceCount}戦`
                          : "-"}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ backgroundColor: theme.palette.action.hover }}
                      >
                        {day.circuit.raceCount > 0 ? (
                          <RateChange
                            value={day.circuit.avgRateChange}
                            size={"1.0rem"}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const CourseSummaryPage = () => {
  // デフォルトのソートキーを、ネストしたキーに変更
  const [searchParams] = useSearchParams();
  // URLに order=asc があれば 'asc' を、なければ 'desc' を初期値にする
  const initialOrder = searchParams.get("order") === "asc" ? "asc" : "desc";
  const [order, setOrder] = useState(initialOrder);
  const [orderBy, setOrderBy] = useState("all.avgRateChange");

  // プルダウンの選択肢となる、重複しない日付のリストを作成
  const uniqueDates = useMemo(
    () =>
      [...new Set(raceData.map((race) => race.date))].sort(
        (a, b) => new Date(a) - new Date(b)
      ),
    []
  );

  const [isAllTime, setIsAllTime] = useState(true);
  const [startDate, setStartDate] = useState(
    uniqueDates.length > 0 ? uniqueDates[0] : ""
  );
  const [endDate, setEndDate] = useState(
    uniqueDates.length > 0 ? uniqueDates[uniqueDates.length - 1] : ""
  );

  const [loading, setLoading] = useState(false);

  // 選択された期間で、表示するデータを絞り込む
  const filteredRaces = useMemo(() => {
    if (isAllTime) {
      return raceData;
    }
    return raceData.filter((race) => {
      const raceDate = new Date(race.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // 開始日と終了日を逆に選んだ場合も考慮
      if (start > end) {
        return raceDate >= end && raceDate <= start;
      }
      return raceDate >= start && raceDate <= end;
    });
  }, [isAllTime, startDate, endDate]);

  // 絞り込んだデータを元に、サマリーを計算
  const courseSummaryData = useMemo(
    () => summarizeByCourse(filteredRaces),
    [filteredRaces]
  );

  const sortedData = useMemo(
    () => stableSort(courseSummaryData, getComparator(order, orderBy)),
    [courseSummaryData, order, orderBy]
  );

  useEffect(() => {
    // URLの?order=...の値が変わったら、ソート順のstateを更新する
    const newOrder = searchParams.get("order") === "asc" ? "asc" : "desc";
    setOrder(newOrder);
    setOrderBy("all.avgRateChange");
    window.scrollTo(0, 0);
  }, [searchParams]); // searchParamsが変わるたびに、この中が実行される

  const handleRequestSort = (property) => {
    const isSameColumn = orderBy === property;

    if (isSameColumn) {
      // 同じ列がクリックされた場合は、単純に昇順/降順を切り替える
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      // 違う列が初めてクリックされた場合
      setOrderBy(property);
      // 列名に'avgRank'（平均順位）が含まれていたら、昇順（asc）をデフォルトにする
      if (property.includes("avgRank")) {
        setOrder("asc");
      } else {
        // それ以外（レース数、平均レート）は、降順（desc）をデフォルトにする
        setOrder("desc");
      }
    }
  };

  // 日付が変更された時の処理
  const handleDateChange = (setter) => (event) => {
    setLoading(true); // まずローディングを開始して、テーブルを透明にする
    setTimeout(() => {
      setter(event.target.value); // 少し遅れて、実際のデータ変更を行う
      setLoading(false); // データ変更が終わったので、ローディングを解除してテーブルを表示
    }, 500); // 50ミリ秒（0.05秒）の遅延
  };

  const handleAllTimeChange = (event) => {
    setLoading(true); // 同じくローディングを開始
    const checked = event.target.checked;
    setTimeout(() => {
      setIsAllTime(checked);
      if (!checked && uniqueDates.length > 0) {
        setStartDate(uniqueDates[0]);
        setEndDate(uniqueDates[uniqueDates.length - 1]);
      }
      setLoading(false);
    }, 500);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1"></Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAllTime}
                onChange={handleAllTimeChange}
                sx={{
                  color: "common.white",
                  "&.Mui-checked": {
                    color: "common.white",
                  },
                }}
              />
            }
            label="全期間"
          />
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <FormControl size="small" disabled={isAllTime}>
                <InputLabel>開始日</InputLabel>
                <Select
                  value={startDate}
                  label="開始日"
                  onChange={handleDateChange(setStartDate)}
                  sx={{ minWidth: 140 }}
                >
                  {uniqueDates.map((date) => (
                    <MenuItem key={date} value={date}>
                      {date}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <Typography>〜</Typography>
            </Grid>
            <Grid>
              <FormControl size="small" disabled={isAllTime}>
                <InputLabel>終了日</InputLabel>
                <Select
                  value={endDate}
                  label="終了日"
                  onChange={handleDateChange(setEndDate)}
                  sx={{ minWidth: 140 }}
                >
                  {uniqueDates.map((date) => (
                    <MenuItem key={date} value={date}>
                      {date}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box>
        <TableContainer component={Paper} style={{ tableLayout: "fixed" }}>
          <StyledTable aria-label="コース別サマリーテーブル">
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
            </colgroup>
            <TableHead>
              {/* 1行目のヘッダー（グループ名） */}
              <TableRow sx={{ backgroundColor: "background.paper" }}>
                <TableCell
                  sx={{ fontSize: "1.1rem" }}
                  rowSpan={2}
                  colSpan={2}
                  align="center"
                >
                  コース名
                </TableCell>
                <TableCell
                  sx={{ fontSize: "1.1rem" }}
                  colSpan={2}
                  align="center"
                >
                  総合
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    color: "text.secondary",
                    // backgroundColor: "action.hover",
                  }}
                  colSpan={2}
                  align="center"
                  className="left-solid"
                >
                  道
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "1.1rem",
                    color: "text.secondary",
                    // backgroundColor: "action.hover",
                  }}
                  colSpan={2}
                  align="center"
                  //   className="left-solid"
                >
                  周回
                </TableCell>
              </TableRow>
              {/* 2行目のヘッダー（各項目のソートラベル） */}
              <TableRow sx={{ backgroundColor: "background.paper" }}>
                {["all", "road", "circuit"].map((type) => (
                  <React.Fragment key={type}>
                    <TableCell
                      style={{ padding: "6px 12px" }}
                      className={type === "road" ? "left-solid" : ""}
                      align="right"
                      sx={
                        type !== "all"
                          ? {
                              color: "text.secondary",
                              //   backgroundColor: "action.hover",
                            }
                          : {}
                      }
                    >
                      <TableSortLabel
                        active={orderBy === `${type}.raceCount`}
                        direction={
                          orderBy === `${type}.raceCount` ? order : "asc"
                        }
                        onClick={() => handleRequestSort(`${type}.raceCount`)}
                      >
                        レース数
                      </TableSortLabel>
                    </TableCell>
                    <TableCell
                      style={{ padding: "6px 12px" }}
                      align="right"
                      sx={
                        type !== "all"
                          ? {
                              color: "text.secondary",
                              //   backgroundColor: "action.hover",
                            }
                          : {}
                      }
                    >
                      <TableSortLabel
                        active={orderBy === `${type}.avgRateChange`}
                        direction={
                          orderBy === `${type}.avgRateChange` ? order : "asc"
                        }
                        onClick={() =>
                          handleRequestSort(`${type}.avgRateChange`)
                        }
                      >
                        レート(平均)
                      </TableSortLabel>
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                opacity: loading ? 0 : 1,
                //   transition: "opacity 0.3s ease-in-out",
                transition: "opacity 0.3s",
              }}
            >
              {sortedData.map((row) => (
                <CourseRow
                  key={row.courseName}
                  row={row}
                  startDate={startDate}
                  endDate={endDate}
                  isAllTime={isAllTime}
                />
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CourseSummaryPage;
