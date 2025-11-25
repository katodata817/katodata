import React, { useMemo } from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import raceData from "../dummyRaces.json";
import comparisonData from "../comparisonData.json";
import { useTheme } from "@mui/material/styles";
import RateChange from "./RateChange";
import { summarizeByDate } from "../utils/utils";

const toolTipSx = {
  padding: { xs: "10px 2px", sm: "2px 2px" },
  fontSize: { xs: "0.8rem", sm: "1.1rem", md: "1.2rem" },
  fontWeight: "bold",
};

const toolTipRateSx = {
  padding: { xs: "10px 2px", sm: "6px 6px" },
  fontSize: { xs: "0.6rem", sm: "0.7rem", md: "1.0rem" },
  fontWeight: "bold",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // ペイロードをレートの高い順にソート
    const sortedPayload = [...payload].sort(
      (a, b) => (b.value || 0) - (a.value || 0)
    );

    // console.log(sortedPayload);

    return (
      <Paper
        sx={{ p: 1.5, backgroundColor: "rgba(0, 0, 0, 0.85)", color: "#fff" }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          {label}
        </Typography>
        <Box>
          {sortedPayload.map((pld) => {
            const changeValue = pld.payload[`${pld.name}_change`];
            return (
              <Box
                key={pld.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: 180,
                  my: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: pld.stroke,
                      mr: 1,
                      borderRadius: "50%",
                    }}
                  />
                  <Typography variant="body2">{pld.name}</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  {/* <Typography variant="body2" component="span" sx={{ mr: 1 }}> */}
                  <Typography sx={toolTipSx}>
                    {changeValue !== null &&
                      changeValue !== undefined &&
                      changeValue !== 0 && (
                        <RateChange
                          value={changeValue}
                          isFixed={false}
                          sx={toolTipRateSx}
                        />
                      )}{" "}
                    {pld.value}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>
    );
  }
  return null;
};

const ComparisonChart = () => {
  const theme = useTheme();

  //   const chartData = useMemo(() => {
  //     const myDailySummary = summarizeByDate(raceData);

  //     const myData = myDailySummary.map((d) => ({
  //       userName: "加藤純一",
  //       date: d.date,
  //       finalRate: d.endRate,
  //       rateChange: d.rateChange,
  //     }));
  //     const allData = [...myData, ...comparisonData];

  //     if (allData.length === 0) return [];

  //     const allUsers = [...new Set(allData.map((d) => d.userName))];
  //     const allDatesSorted = [...new Set(allData.map((d) => d.date))].sort(
  //       (a, b) => new Date(a) - new Date(b)
  //     );
  //     if (allDatesSorted.length === 0) return [];

  //     const minDate = new Date(allDatesSorted[0]);
  //     const maxDate = new Date(
  //       Math.max(new Date(allDatesSorted[allDatesSorted.length - 1]), new Date())
  //     );

  //     const continuousDates = [];
  //     let currentDate = new Date(minDate);
  //     while (currentDate <= maxDate) {
  //       continuousDates.push(currentDate.toISOString().slice(0, 10));
  //       currentDate.setDate(currentDate.getDate() + 1);
  //     }
  //     // 3. 連続した日付を元に、グラフ用のデータを作り直す
  //     const latestValues = {};
  //     allUsers.forEach((user) => {
  //       latestValues[user] = { rate: null, change: null };
  //     });

  //     const latestRates = {};
  //     allUsers.forEach((user) => {
  //       latestRates[user] = null;
  //     });

  //     const resultData = continuousDates.map((date) => {
  //       const dateEntry = { date };
  //       allUsers.forEach((user) => {
  //         const userDataForDay = allData.find(
  //           (d) => d.date === date && d.userName === user
  //         );
  //         if (userDataForDay) {
  //           latestRates[user] = userDataForDay.finalRate;
  //         }
  //         // ↓↓↓【修正】ネストをやめて、平坦なキーでデータを格納する ↓↓↓
  //         dateEntry[`${user}_rate`] = latestRates[user];
  //         dateEntry[`${user}_change`] = userDataForDay
  //           ? userDataForDay.rateChange
  //           : null;
  //       });
  //       return dateEntry;
  //     });
  //     // console.log(
  //     //   "4. 最終的なグラフ用データ (resultDataの最後の5件):",
  //     //   JSON.stringify(resultData, null, 2)
  //     // );

  //     return resultData;
  //   }, []);

  const chartData = useMemo(() => {
    const myDailySummary = summarizeByDate(raceData);

    const myData = myDailySummary.map((d) => ({
      userName: "加藤純一",
      date: d.date,
      finalRate: d.endRate,
      rateChange: d.rateChange,
    }));
    const allData = [...myData, ...comparisonData];

    if (allData.length === 0) return [];

    const allUsers = [...new Set(allData.map((d) => d.userName))];
    // これが「実際にデータが存在する日付」のリスト
    const allDatesSorted = [...new Set(allData.map((d) => d.date))].sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // 1. 「今日」の日付を "YYYY-MM-DD" 形式で取得
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    // 2. もし、日付リストの最後に「今日」がなければ、追加する
    if (
      allDatesSorted.length > 0 &&
      allDatesSorted[allDatesSorted.length - 1] !== todayStr
    ) {
      allDatesSorted.push(todayStr);
    }

    if (allDatesSorted.length === 0) return [];

    // 連続した日付を作るのをやめて、allDatesSortedを直接使う
    const latestRates = {};
    allUsers.forEach((user) => {
      latestRates[user] = null;
    });

    const resultData = allDatesSorted.map((date) => {
      // ← ここで allDatesSorted を使う
      const dateEntry = { date };
      allUsers.forEach((user) => {
        const userDataForDay = allData.find(
          (d) => d.date === date && d.userName === user
        );
        // その日にデータがあれば、その人の最新レートを更新する
        if (userDataForDay) {
          latestRates[user] = userDataForDay.finalRate;
        }

        dateEntry[`${user}_rate`] = latestRates[user];
        dateEntry[`${user}_change`] = userDataForDay
          ? userDataForDay.rateChange
          : null;
      });
      return dateEntry;
    });

    return resultData;
  }, []);

  const yAxisTicks = useMemo(() => {
    if (chartData.length === 0) return { domain: [0, 0], ticks: [0] };

    let minRate = Infinity;
    let maxRate = -Infinity;

    // 新しいデータ構造に合わせて、最小・最大レートを探す
    chartData.forEach((d) => {
      Object.keys(d).forEach((key) => {
        // キーが「_rate」で終わり、かつ、値がnullじゃないものを探す
        if (key.endsWith("_rate") && d[key] !== null) {
          if (d[key] < minRate) minRate = d[key];
          if (d[key] > maxRate) maxRate = d[key];
        }
      });
    });

    if (minRate === Infinity)
      return { domain: [8000, 9000], ticks: [8000, 8500, 9000] };

    const domainMin = Math.floor(minRate / 100) * 100;
    const domainMax = Math.ceil(maxRate / 100) * 100;

    const ticks = [];
    for (let i = domainMin; i <= domainMax; i += 100) {
      ticks.push(i);
    }

    return { domain: [domainMin, domainMax], ticks };
  }, [chartData]);

  const userColors = {
    加藤純一: theme.palette.info.main,
    たいじ: "#63b382ff",
    バトラ: "#8f8be5ff",
  };

  return (
    <Paper sx={{ py: 2, height: 500 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          ml: 2,
        }}
      >
        <Typography variant="subtitle1" color="info.main">
          レート比較
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 14, fill: theme.palette.text.primary }}
            tickFormatter={(dateStr) =>
              new Date(dateStr).toLocaleDateString("ja-JP", {
                month: "numeric",
                day: "numeric",
              })
            }
            height={60}
            dy={10}
          />
          <YAxis
            domain={yAxisTicks.domain}
            ticks={yAxisTicks.ticks}
            tick={{ fontSize: 14, fill: theme.palette.text.primary }}
          />
          <Tooltip
            content={<CustomTooltip />}
            wrapperStyle={{ zIndex: 1000 }}
            offset={40}
          />
          <Legend />
          {Object.keys(userColors).map((userName) => (
            <Line
              key={userName}
              type="stepAfter"
              dataKey={`${userName}_rate`}
              name={userName}
              stroke={userColors[userName]}
              strokeWidth={userName === "加藤純一" ? 4 : 1}
              dot={false}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ComparisonChart;
