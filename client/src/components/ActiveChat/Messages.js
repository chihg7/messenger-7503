import React, { useEffect } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";


const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const bottomOfMessages = React.createRef();

  useEffect(() => { scrollToBottom(); });

  const scrollToBottom = () => {
    bottomOfMessages.current.scrollIntoView({ behavior: 'auto' });
  };

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
      <div ref={bottomOfMessages}></div>
    </Box>
    
  );
};

export default Messages;
