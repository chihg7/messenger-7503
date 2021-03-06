import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { connect } from "react-redux";
import { Chat, CurrentUser, Search } from "./index.js";
import { theme } from "../../themes/theme";


const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width:"100%", height: "100%",
    padding: 10
  },
  chatsWrapper: {
    position: "relative",
    width:"100%", height: "100%"
  },
  chatsContainer: {
    position: "absolute",
    top: theme.spacing(0),
    bottom: theme.spacing(5),
    width:"100%",
    overflowY: "scroll"
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15
  }
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const conversations = props.conversations || [];
  const { handleChange, searchTerm } = props;

  return (
    <Box className={classes.root}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      <Box className={classes.chatsWrapper}>
        <Box className={[classes.chatsContainer, "styled-scrollbar"]}>
          {conversations
            .filter((conversation) => conversation.otherUser.username.includes(searchTerm))
            .map((conversation) => { 
              return <Chat conversation={conversation}
                  key={conversation.otherUser.username} />
            })
          }
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations
  };
};

export default connect(mapStateToProps, null)(Sidebar);
