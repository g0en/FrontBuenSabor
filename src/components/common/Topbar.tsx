import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfig";
import sizeConfigs from "../../configs/sizeConfig";

const Topbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color
      }}
    >
      <Toolbar>
        <Typography variant="h6">
          React sidebar with dropdown
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;