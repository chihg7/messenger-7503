import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage, removeOfflineUser,
  addOnlineUser, updateReadMessages
} from "./store/conversations";
import jwtDecode from "jwt-decode";


const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");
  const token = localStorage.getItem("messenger-token");
  const currentUser = jwtDecode(token);

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    // Verify pertinency of the call by checking if 
    // current user is the intended recipient
    if(currentUser.id === data.recipientId)
      store.dispatch(setNewMessage(data.message, data.sender));
  });
  socket.on("messages-read", (data) => {
    // Verify pertinency of the call by checking if
    // current user is the intended recipient
    if(currentUser.id === data.recipientId) {
      const { conversationId, lastReadMessageId } = data;
      store.dispatch(updateReadMessages(conversationId, lastReadMessageId));
    }
  });
});

export default socket;
