import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/thunkCreators";
import { clearOnLogout } from "../store/index";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%", height: "100%",
    direction: "row", wrap: "nowrap",
    justifyContent: "flex-start",
    position: "fixed"
  },
  panel: {
    position: "relative",
    height: "100%"
  }
}));

const Home = (props) => {
  const classes = useStyles();
  const { user, logout, fetchConversations } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user.id) {
      setIsLoggedIn(true);
    }
  }, [user.id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (!user.id) {
    // If we were previously logged in, redirect to login instead of register
    if (isLoggedIn) return <Redirect to="/login" />;
    return <Redirect to="/register" />;
  }

  const handleLogout = async () => {
    await logout(user.id);
  };

  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout} >
        Logout
      </Button>
      <Grid container component="main" className={classes.root} spacing={3}>
        <CssBaseline />
        <Grid item xs={12} md={4} className={classes.panel}>
          <SidebarContainer />
        </Grid>
        <Grid item xs={12} md={8} className={classes.panel}>
          <ActiveChat />
        </Grid>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
