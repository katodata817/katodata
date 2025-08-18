import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
// import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

// アクティブな時と、通常時のスタイルを共通化
const navButtonSx = {
  py: 1,
  px: 2,
  borderRadius: 2,
  color: "inherit",
  fontWeight: "normal",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  // ↓↓↓ これがアクティブな時のスタイル ↓↓↓
  "&.active": {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    fontWeight: "bold",
  },
};

const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h5"
          component={RouterNavLink}
          to="/"
          sx={{
            flexGrow: 1,
            color: "inherit", // 親の色を継承
            textDecoration: "none", // リンクの下線を消す
          }}
        >
          カトデータ
        </Typography>
        <Box>
          <Button
            variant="h5"
            component={RouterNavLink}
            to="/"
            sx={navButtonSx}
          >
            トップ
          </Button>
          <Button
            variant="h5"
            component={RouterNavLink}
            to="/summary/course"
            sx={navButtonSx}
          >
            コース別まとめ
          </Button>
          <Button
            variant="h5"
            component={RouterNavLink}
            to="/summary/daily"
            sx={navButtonSx}
          >
            レース履歴
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
