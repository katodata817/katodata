import React, { useMemo } from "react";
import { Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
  Dot,
} from "recharts";
import { useTheme } from "@mui/material/styles";

// 新しいサンプリング関数
//  const sampleRaces = (races, sampleRate) => {
//    if (races.length <= sampleRate) {
//      return races;
//    }

//    // 1. 最高レートのレースを見つける
//    const peakRace = races.reduce((prev, current) => (prev.rateAfter > current.rateAfter) ? prev: current);

//    const sampledData = new Map(); // 重複を避けるためMapを使う

//    // 2. 間引き処理と、特別扱いの点を追加
//    races.forEach((race, index) => {
//      // 最初の点、最後の点、sampleRateごとの点、そして最高レートの点は必ず拾う
//      if (
//        index === 0 ||
//        index === races.length - 1 ||
//        index % sampleRate === 0 ||
//        race.id === peakRace.id
//      ) {
//        sampledData.set(race.id, race);
//      }
//    });

//    // Mapから配列に戻し、ID順にソートして返す
//    return Array.from(sampledData.values()).sort((a, b) => a.id - b.id);
//  };

// ↓↓↓【新規】日付ごとのレースIDの範囲を計算する関数 ↓↓↓
const getDateIdRanges = (races) => {
  if (races.length === 0) {
    return [];
  }
  const ranges = [];
  let currentRange = {
    date: races[0].date,
    startId: races[0].id,
    endId: races[0].id,
    raceCount: 1, // レース数のカウントを開始
  };

  for (let i = 1; i < races.length; i++) {
    const race = races[i];
    if (race.date === currentRange.date) {
      currentRange.endId = race.id;
      currentRange.raceCount++; // 同じ日ならレース数を増やす
    } else {
      ranges.push(currentRange);
      currentRange = {
        date: race.date,
        startId: race.id,
        endId: race.id,
        raceCount: 1,
      };
    }
  }
  ranges.push(currentRange); // 最後の日のデータを追加

  return ranges;
};
// ↓↓↓【新規】日付とレース数を表示するためのカスタムラベルコンポーネント ↓↓↓
const CustomLabel = ({ viewBox, date, raceCount }) => {
  const theme = useTheme();
  const { x, y } = viewBox;
  return (
    <g transform={`translate(${x + 10}, ${y + 14})`}>
      <text
        x={0}
        y={0}
        dy={10}
        fill={theme.palette.text.primary}
        fontSize={16}
        fontWeight="bold"
      >
        {new Date(date).toLocaleDateString("ja-JP", {
          month: "numeric",
          day: "numeric",
        })}
      </text>
      <text
        x={0}
        y={0}
        dy={32}
        fill={theme.palette.text.secondary}
        fontSize={16}
      >
        {raceCount}戦
      </text>
    </g>
  );
};

// 最高レートの点にだけ、特別な「星マーク」みたいなのを付けるためのカスタムドット
const CustomizedDot = (props) => {
  const theme = useTheme();
  const { cx, cy, stroke, payload, peakRate } = props;
  if (payload.rateAfter === peakRate) {
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={6}
        stroke={stroke}
        strokeWidth={2}
        fill={theme.palette.info.secondary}
      />
    );
  }
  return <Dot cx={cx} cy={cy} r={2} fill={stroke} />;
};

const CustomTooltip = ({ active, payload }) => {
  const isVisible = active && payload && payload.length;
  return (
    <div
      className="custom-tooltip"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", padding: "1px 10px" }}
    >
      {isVisible && (
        <>
          <p className="label">{`レート : ${payload[0].value}`}</p>
        </>
      )}
    </div>
  );
};

const RateChart = ({ races }) => {
  const theme = useTheme();
  const chartData = useMemo(() => races, [races]); // サンプリングをやめて全量表示
  const peakRate = useMemo(
    () => Math.max(...races.map((r) => r.rateAfter)),
    [races]
  );
  const dateRanges = useMemo(() => getDateIdRanges(races), [races]);

  // 全データの最初と最後のIDを計算
  const minId = races.length > 0 ? races[0].id : 0;
  const maxId = races.length > 0 ? races[races.length - 1].id : 0;

  return (
    <Paper sx={{ p: 2, mb: 4 }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 6"
            strokeOpacity={0.6}
            stroke="#ffffff"
          />
          <XAxis
            dataKey="id"
            type="number"
            domain={[minId, maxId]}
            hide={true}
          />
          <YAxis
            domain={[7900, 8600]}
            tickCount={8}
            tick={{ fontSize: 16, fill: theme.palette.text.primary }}
          />
          <Tooltip
            content={CustomTooltip}
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
            }}
            labelStyle={{ color: "#fff" }}
            // formatter={(value, name, props) => [`${value} (レースID: ${props.payload.id})`, name]}
          />

          {dateRanges.map((range, index) => (
            <ReferenceArea
              key={range.date}
              x1={range.startId}
              x2={range.endId === maxId ? range.endId : range.endId + 1}
              stroke="none"
              fill={
                index % 2 === 0
                  ? theme.palette.action.hover
                  : theme.palette.action.focus
              }
              label={
                <CustomLabel date={range.date} raceCount={range.raceCount} />
              }
            />
          ))}

          <Line
            type="linear"
            dataKey="rateAfter"
            name="レート"
            stroke={theme.palette.info.main}
            strokeWidth={1}
            activeDot={{ r: 4 }}
            dot={<CustomizedDot peakRate={peakRate} />}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default RateChart;
