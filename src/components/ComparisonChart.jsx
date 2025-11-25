import React, { useMemo, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import raceData from "../dummyRaces.json";
import comparisonData from "../comparisonData.json";
import { useTheme } from "@mui/material/styles";
import RateChange from "./RateChange";
import { summarizeByDate } from "../utils/utils";

// --- ↓↓↓【変更点1】Tooltipの代わりに、固定表示用のコンポーネントを新設 ↓↓↓ ---
const FixedInfoBox = ({ activeData }) => {
  // activeDataがない（マウスがグラフの外にある）時は、何も表示しない
  if (!activeData || activeData.length === 0) {
    return null;
  }

  // payloadをレートの高い順にソート
  const sortedPayload = [...activeData].sort(
    (a, b) => (b.value || 0) - (a.value || 0)
  );
  const label = sortedPayload[0]?.payload?.date || "";

  return (
    <Box sx={{ p: 1, minHeight: 120 }}>
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
                wid: 180,
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
                <Typography>
                  {changeValue !== null &&
                    changeValue !== undefined &&
                    changeValue !== 0 && (
                      <RateChange
                        value={changeValue}
                        isFixed={false}
                        sx={{ mr: 1 }}
                      />
                    )}
                  {pld.value}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const ComparisonChart = () => {
  const theme = useTheme();

  const [activeData, setActiveData] = useState(null);

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
  }, [comparisonData]);

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

  // マウスがグラフから離れた時に、情報をクリアする
  const handleMouseLeave = () => {
    setActiveData(null);
  };

  return (
    <Paper sx={{ py: 2, height: 500, position: "relative" }}>
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
          onMouseMove={(state) => {
            // isTooltipActiveは、マウスがデータ点の上にあるかどうかのフラグ
            if (state.isTooltipActive) {
              const index = state.activeTooltipIndex;
              const dataEntry = chartData[index];

              // FixedInfoBoxが期待するpayloadの形を、手動で作り直す
              const reconstructedPayload = Object.keys(userColors)
                .map((userName) => ({
                  name: userName,
                  value: dataEntry[`${userName}_rate`],
                  stroke: userColors[userName],
                  payload: dataEntry,
                }))
                .filter((item) => item.value !== null); // データがない人は除外
              setActiveData(reconstructedPayload);
            }
          }}
          onMouseLeave={handleMouseLeave}
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
              isAnimationActive={false}
            />
          ))}
          <Legend />
        </LineChart>
      </ResponsiveContainer>
      {/* 固定表示用の情報ボックスを、右側に配置 */}
      <Box
        sx={{
          position: "absolute", // 親(Paper)を基準に、絶対位置を指定
          top: 50, // 上から50px
          left: 80, // 左から40px
          zIndex: 10, // グラフより手前に表示
          width: 200,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明の背景
          borderRadius: 2,
          color: "white",
          pointerEvents: "none", // このBox自体は、マウス操作を無視する
        }}
      >
        <FixedInfoBox activeData={activeData} />
      </Box>
    </Paper>
  );
};

export default ComparisonChart;
