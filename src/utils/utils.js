export const summarizeByCourse = (races) => {
  const stats = races.reduce((acc, race) => {
    const { course, rank, rateChange, type } = race;
    if (!acc[course]) {
      acc[course] = {
        all: { raceCount: 0, totalRank: 0, totalRateChange: 0 },
        road: { raceCount: 0, totalRank: 0, totalRateChange: 0 },
        circuit: { raceCount: 0, totalRank: 0, totalRateChange: 0 },
      };
    }

    // 総合計を更新
    acc[course].all.raceCount++;
    acc[course].all.totalRank += rank;
    acc[course].all.totalRateChange += rateChange;

    // 種類別の合計を更新
    const typeKey = type === '周回' ? 'circuit' : 'road';
    acc[course][typeKey].raceCount++;
    acc[course][typeKey].totalRank += rank;
    acc[course][typeKey].totalRateChange += rateChange;

    return acc;
  }, {});

  // 平均を計算して最終的なデータ形式に変換
  return Object.entries(stats).map(([courseName, data]) => {
    const calcAverages = (summary) => summary.raceCount > 0 ? {
      raceCount: summary.raceCount,
      avgRank: summary.totalRank / summary.raceCount,
      avgRateChange: summary.totalRateChange / summary.raceCount,
    } : { raceCount: 0, avgRank: 0, avgRateChange: 0 };

    return {
      courseName,
      all: calcAverages(data.all),
      road: calcAverages(data.road),
      circuit: calcAverages(data.circuit),
    };
  });
};

export const summarizeByDate = (races) => {
  if (races.length === 0) return [];

  const dailyStats = {};

  races.forEach(race => {
    const { date, rank, rateChange, rateAfter } = race;
    if (!dailyStats[date]) {
      dailyStats[date] = {
        races: [],
        startRate: race.rateAfter - rateChange, // その日の最初のレート
      };
    }
    dailyStats[date].races.push(race);
    dailyStats[date].endRate = rateAfter; // 常に最後のレートで上書き
  });

  return Object.values(dailyStats).map(day => {
    const raceCount = day.races.length;
    const rateChange = day.endRate - day.startRate;
    const avgRank = day.races.reduce((sum, race) => sum + race.rank, 0) / raceCount;

    return {
      date: day.races[0].date,
      raceCount,
      startRate: day.startRate,
      endRate: day.endRate,
      rateChange,
      avgRank,
      races: day.races, // その日の全レースデータ
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // 日付の降順でソート
};