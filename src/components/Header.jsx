import React from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
// import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

// アクティブな時と、通常時のスタイルを共通化
const navButtonSx = {
  padding: { xs: "12px 2px", sm: "10px 16px" },
  fontSize: { xs: "0.8rem", sm: "1.0rem", md: "1.1rem" },
  borderRadius: 2,
  color: "inherit",
  fontWeight: "normal",
  textDecoration: "none",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: "#969cf1",
  },
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
          component={RouterNavLink}
          to="/"
          sx={{
            padding: { xs: "12px 2px", sm: "10px 16px" },
            fontSize: { xs: "1.2rem", sm: "1.0rem", md: "1.6rem" },
            color: "inherit", // 親の色を継承
            "&:hover": {
              color: "#969cf1",
            },
            textDecoration: "none", // リンクの下線を消す
          }}
        >
          カトデータ
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Button component={RouterNavLink} to="/" sx={navButtonSx}>
            <HomeIcon />
            トップ
          </Button>
          <Button
            component={RouterNavLink}
            to="/summary/course"
            sx={navButtonSx}
          >
            コース別まとめ
          </Button>
          <Button
            component={RouterNavLink}
            to="/summary/daily"
            sx={navButtonSx}
          >
            レース履歴
          </Button>
          {/* <Button component={RouterNavLink} to="/other" sx={navButtonSx}>
            その他データ
          </Button> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
