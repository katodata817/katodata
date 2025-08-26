import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import StyledTable from "./StyledTable";
import RateChange from "./RateChange";
import { useTheme } from "@mui/material/styles";

const TypeChip = ({ type }) => {
  const label = type === "周回" ? "周回" : "道";
  const color = type === "周回" ? "primary" : "secondary";
  return <Chip label={label} color={color} size="large" />;
};
const childHeaderSx = {
  padding: { xs: "6px 10px", sm: "6px 10px" },
  fontSize: { xs: "0.6rem", sm: "0.8rem", md: "0.9rem" },
};

const childBodySx = {
  padding: { xs: "6px 6px", sm: "6px 10px" },
  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.0rem" },
};

const childCaptionSx = {
  padding: { xs: "0px 0px", sm: "0px 0px" },
  fontSize: { xs: "0.6rem", sm: "0.6rem", md: "0.7rem" },
  color: "text.secondary",
};

const childRateSx = {
  padding: { xs: "0px 6px 0px 0px", sm: "16px 6px 16px 0px" },
  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
};

const RaceTable = ({ races }) => {
  const sortedRaces = useMemo(
    () => [...races].sort((a, b) => b.id - a.id),
    [races]
  );
  const theme = useTheme();
  if (!races || races.length === 0) {
    return <p>表示するレースデータがありません。</p>;
  }

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
            <col style={{ width: "5%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "2%" }} />
          </colgroup>
          <TableHead>
            <TableRow style={{ backgroundColor: theme.palette.action.hover }}>
              <TableCell sx={childHeaderSx} align="center">
                {" "}
              </TableCell>
              <TableCell sx={childHeaderSx}>コース</TableCell>
              <TableCell sx={childHeaderSx} align="right">
                順位
              </TableCell>
              <TableCell sx={childHeaderSx} align="center" colSpan={2}>
                レート
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRaces.map((race) => (
              <TableRow key={race.id} hover>
                <TableCell component="th" scope="row" sx={childBodySx}>
                  {race.id}
                </TableCell>
                <TableCell sx={childBodySx}>
                  {race.type === "道" && race.from && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={childCaptionSx}
                    >
                      {race.from}→
                    </Typography>
                  )}
                  {race.course}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    // 順位が3位以内なら、fontWeightを'bold'（太字）に設定
                    fontWeight: race.rank === 1 ? "bold" : "normal",
                    // 1位なら、さらに色を金色っぽくして特別感を出す（おまけ）
                    color: race.rank <= 3 ? "info.main" : "inherit",
                    ...childBodySx,
                  }}
                >
                  {/* 順位が1位なら、王冠の絵文字を追加 */}
                  {race.rank === 1 ? "👑 " : ""}
                  {race.rank}位
                </TableCell>
                <TableCell align="right" sx={childBodySx}>
                  {race.rateAfter}
                </TableCell>
                <TableCell sx={childRateSx} align="left">
                  <RateChange
                    value={race.rateChange}
                    isFixed={false}
                    sx={childRateSx}
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

export default RaceTable;
