import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { setMessagesStatusToRead } from "../../store/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%", 
  },
  acWrapper: {
    position: "relative",
    height: "93vh",
    display: "flex",
    flexDirection: "column",
  },
  userContainer: {
    zIndex: "9",
    position: "absolute",
    top: 0, left: 0, right: 0,
    width: "100%"
  },
  inputContainer: {
    zIndex: "9",
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    width: "100%"
  },
  messageContainer: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 30,
    position: "absolute",
    top: 100, left: 0, right: 0, bottom: 100,
    overflowY: "auto"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, setMessagesStatusToRead } = props;
  const conversation = props.conversation || {};

  useEffect(() => {
      setMessagesStatusToRead(conversation.id);
  }, [conversation.id, setMessagesStatusToRead]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <Box className={classes.acWrapper}>
          <Box className={classes.userContainer}>
            <Header 
              username={conversation.otherUser.username}
              online={conversation.otherUser.online || false}
            />
          </Box>
          <Box className={[classes.messageContainer, "styled-scrollbar"]}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
          </Box>
          <Box className={classes.inputContainer}>
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => ({
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find((conversation) => 
        conversation.otherUser.username === state.activeConversation)
});

const mapDispatchToProps = (dispatch) => {
  return {
    setMessagesStatusToRead: (conversationId) => {
      dispatch(setMessagesStatusToRead(conversationId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
