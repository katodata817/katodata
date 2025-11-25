import React, { useMemo } from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import raceData from "../dummyRaces.json";
import ComparisonChart from "../components/ComparisonChart";
import { useTheme } from "@mui/material/styles";

// --- 1. 順位分布のグラフ用コンポーネント ---
const RankDistributionChart = () => {
  const theme = useTheme();

  const rankData = useMemo(() => {
    const counts = raceData.reduce((acc, race) => {
      acc[race.rank] = (acc[race.rank] || 0) + 1;
      return acc;
    }, {});
    return Array.from({ length: 24 }, (_, i) => i + 1).map((rank) => ({
      name: `${rank}位`,
      count: counts[rank] || 0,
    }));
  }, []);

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" color="info.main">
          順位分布
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rankData}
          margin={{ top: 0, right: 40, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: theme.palette.text.primary }}
          />
          {/* <YAxis
          allowDecimals={false}
          tick={{ fontSize: 16, fill: theme.palette.text.primary }}
          /> */}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "none",
            }}
          />
          <Bar dataKey="count" name="回数" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

// --- 2. レースタイプ割合の円グラフ用コンポーネント ---
const TypePieChart = () => {
  const pieData = useMemo(() => {
    const counts = raceData.reduce((acc, race) => {
      const typeKey = race.type === "周回" ? "周回" : "道";
      acc[typeKey] = (acc[typeKey] || 0) + 1;
      return acc;
    }, {});
    return [
      { name: "周回", value: counts["周回"] || 0 },
      { name: "道", value: counts["道"] || 0 },
    ];
  }, []);
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${pieData[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" color="info.main">
          コース種別
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="40%"
            outerRadius={100}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

// --- 3. 上記のグラフを配置する、メインのページコンポーネント ---
const OtherDataPage = () => {
  return (
    <Box>
      <Grid container spacing={3} pb={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TypePieChart />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <RankDistributionChart />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <ComparisonChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OtherDataPage;
