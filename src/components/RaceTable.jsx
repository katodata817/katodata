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
            <col style={{ width: "5%" }} /> {/* ID */}
            <col style={{ width: "auto" }} /> {/* コース名 */}
            <col style={{ width: "20%" }} /> {/* ） */}
            <col style={{ width: "12%" }} /> {/* 開始レート */}
            <col style={{ width: "3%" }} />
          </colgroup>
          <TableHead>
            <TableRow style={{ backgroundColor: theme.palette.action.hover }}>
              <TableCell sx={{ fontSize: "1.0rem" }} align="center">
                {" "}
              </TableCell>
              <TableCell sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                コース
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
                align="right"
              >
                順位
              </TableCell>
              <TableCell
                sx={{ fontSize: "0.9rem", fontWeight: "bold" }}
                align="right"
                colSpan={2}
              >
                レート
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRaces.map((race) => (
              <TableRow key={race.id} hover>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    padding: "16px 10px",
                    fontSize: "1.0rem",
                  }}
                >
                  {race.id}
                </TableCell>
                <TableCell
                  style={{ padding: "6px 12px" }}
                  sx={{
                    fontSize: "1.0rem",
                  }}
                >
                  {race.type === "道" && race.from && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ color: "text.secondary" }}
                    >
                      {race.from}→
                    </Typography>
                  )}
                  {race.course}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: "1.0rem",
                  }}
                >
                  {race.rank}位
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: "1.0rem",
                  }}
                >
                  {race.rateAfter}
                </TableCell>
                <TableCell style={{ padding: "0px 12px 0px 0px" }} align="left">
                  <RateChange
                    value={race.rateChange}
                    isFixed={false}
                    size={"1.0rem"}
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
