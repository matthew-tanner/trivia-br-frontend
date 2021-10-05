import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
      background: "#222831"
    },
    title: {
      flexGrow: 1,
      textDecoration: "none",
    },
    header: {
      textColor: "white",
    },
  })
);

interface MenuAppBarProps {
  token: string;
  isAdmin: boolean;
  clearToken: () => void;
}

export default function MenuAppBar(props: MenuAppBarProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    props.clearToken();
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.header}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link style={{ textDecoration: "none", color: "white" }} to="/home">
              YATG
            </Link>
          </Typography>
          {!props.token && (
            <>
              <Typography variant="h6" className={classes.title}>
                <Link style={{ textDecoration: "none", color: "white" }} to="/register">
                  Register
                </Link>
              </Typography>
              <Typography variant="h6" className={classes.title}>
                <Link style={{ textDecoration: "none", color: "white" }} to="/login">
                  Login
                </Link>
              </Typography>
            </>
          )}
          {props.token && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                {props.isAdmin &&<MenuItem onClick={handleClose}>
                  <Link style={{ textDecoration: "none", color: "black" }} to="/admin">
                    Admin
                  </Link>
                </MenuItem>}
                <MenuItem onClick={handleClose}>
                  <Link style={{ textDecoration: "none", color: "black" }} to="/dashboard">
                    Dashboard
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Typography onClick={handleLogout}>Logout</Typography>
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
