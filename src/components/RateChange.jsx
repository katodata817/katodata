import React from "react";
import { Typography } from "@mui/material";

const RateChange = ({ value, sx = {}, isFixed = true }) => {
  if (value === null || value === undefined || value === 0) {
    // 0の場合は色を付けずに表示
    return (
      <Typography
        component="span"
        sx={sx}
        //   variant="body2"
        //   sx={{  }}
      >
        {isFixed ? value.toFixed(2) : value}
      </Typography>
    );
  }

  const isPositive = value > 0;
  const color = isPositive ? "success.secondary" : "error.secondary";

  const displayValue = isFixed ? value.toFixed(2) : value;
  const formattedValue = `${isPositive ? "+" : ""}${displayValue}`;

  return (
    <Typography
      component="span"
      //   variant="body2"
      //   sx={{ color, fontWeight: 'bold' }}
      sx={{ color, ...sx }}
      //   sx={{ color }}
    >
      {formattedValue}
    </Typography>
  );
};

export default RateChange;
