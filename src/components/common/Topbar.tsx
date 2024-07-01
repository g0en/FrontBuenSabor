import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../configs/colorConfig";
import sizeConfigs from "../../configs/sizeConfig";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Topbar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 0)`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color
      }}
    >
      <Toolbar>
        <Typography variant="h6">
        </Typography>
      </Toolbar>
      <div className="-ml-8 flex-col gap-2.5 sm:flex-row sm:justify-center lg:flex lg:justify-start">
        {isAuthenticated ? (
          <>
            <LogoutButton />
          </>
        ) : (
          <>
            <LoginButton />
          </>
        )}
      </div>
    </AppBar>
  );
};

export default Topbar;