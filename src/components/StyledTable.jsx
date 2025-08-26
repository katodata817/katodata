import { BorderBottom, BorderLeft } from "@mui/icons-material";
import { Table } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTable = styled(Table)(({ theme }) => ({
  width: "100%",
  border: 0,
  //   tableLayout: 'fixed',
  "& .MuiTableHead-root": {
    "& .left-solid": {
      borderLeft: `2px solid ${theme.palette.divider}`,
    },
  },

  // --- ボディ行のスタイリング ---
  "& .MuiTableBody-root": {
    borderBottom: `0px solid ${"#00ff00"}`,
    "& .main-row:hover": {
      backgroundColor: theme.palette.action.selected,
    },

    // --- 親の行のスタイル ---
    "& .main-row > td": {
      borderBottom: `0px solid ${"#ffff00"}`,
      //   padding: "6px 6px",
      //   backgroundColor: theme.palette.action.hover,
    },
    // --- 子の行（展開された行）のスタイル ---
    "& .collapse-row > td": {
      borderBottom: `0px solid ${"#ff00ff"}`,
      fontWeight: "light",
      padding: 0,
    },

    "& .left-solid": {
      borderLeft: `2px solid ${theme.palette.divider}`,
    },
    "& .left-info": {
      borderLeft: `5px solid ${theme.palette.info.main}`,
    },
  },

  "& .MuiTableCell-root": {
    border: `0px solid ${theme.palette.divider}`,
  },
}));

export default StyledTable;
// const StyledTable = styled(Table)(({ theme }) => ({
//   width: '100%',
// //   tableLayout: 'fixed',

//   // --- ボディ行のスタイリング ---
//   '& .MuiTableBody-root': {
//     // --- 親の行（メインのデータ行）のスタイル ---
//     '& .main-row': {
//       '&:nth-of-type(2n + 1)': {backgroundColor: theme.palette.action.hover},
//       '&:hover': {backgroundColor: theme.palette.action.selected},
//     },

//     // --- 子の行（展開された行）のスタイル ---
//     '& .collapse-row > td': {
//       padding: 0,
//       border: 0,
// 	  backgroundColor: theme.palette.background.paper,
//     },
//     // --- 色を同期させる魔法 ---
//     // 親(main-row)の状態に応じて、すぐ下の弟(collapse-row)の、
//     // 中にある「一番最初のセル(.dummy-stripe-cell)」の背景色を変える
//     '& .main-row:nth-of-type(2n + 1) + .collapse-row .dummy-stripe-cell': {
// 		backgroundColor: theme.palette.action.hover,
// 	},
// 	'& .main-row:hover + .collapse-row .dummy-stripe-cell': {
// 		backgroundColor: theme.palette.action.selected,
// 	},

// 	// 親が「偶数行」の場合、子の行の背景色も変える
//     '& .main-row:nth-of-type(2n + 1) + .collapse-row > td': {
//       backgroundColor: theme.palette.action.hover,
//     },
//     // 親が「ホバー状態」の場合、子の行の背景色も変える
//     '& .main-row:hover + .collapse-row > td': {
//       backgroundColor: theme.palette.action.selected,
//     },
//   },
// }));

// export default StyledTable;
