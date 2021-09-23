import React, { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;
  // const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const unreadMessagesCount = conversation.messages
    .filter(message => (
      message.senderId === conversation.otherUser.id 
      && message.readAt === null)
    ).length;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      { unreadMessagesCount > 0 && (
        <Chip 
            color="primary" size="small"
            label= { unreadMessagesCount }
        />
      )}
    </Box>
  );
};

export default ChatContent;
