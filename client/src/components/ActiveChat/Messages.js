import { Box, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React, { useEffect } from "react";
import { OtherUserBubble, SenderBubble } from "../ActiveChat";

const useStyles = makeStyles(() => ({
  readingStatusBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  avatar: {
    height: 15,
    width: 15,
    marginLeft: 11,
    marginTop: 3
  },
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId, lastReadMessageId } = props;

  const bottomOfMessages = React.createRef();

  useEffect(() => { scrollToBottom(); });

  const scrollToBottom = () => {
    bottomOfMessages.current.scrollIntoView({ behavior: 'auto' });
  };

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return ( 
          <Box key={message.id}>
            {message.senderId === userId ? (
              <SenderBubble 
                 text={message.text}
                time={time}
              />
            ) : (
              <OtherUserBubble
                text={message.text} 
                time={time} otherUser={otherUser}
              />
            )}
            { message.id === lastReadMessageId && (
              <Box className={classes.readingStatusBar}>
                <Avatar 
                  alt={otherUser.username} 
                  src={otherUser.photoUrl}
                  className={classes.avatar}>
                </Avatar>
              </Box>
            )}
          </Box>
        );
      })}
      <div ref={bottomOfMessages}></div>
    </Box>
  );
};

export default Messages;
