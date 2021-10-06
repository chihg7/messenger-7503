import {
  addNewConvoToStore, addOnlineUserToStore,
  addSearchedUsersToStore, removeOfflineUserFromStore,
  addMessageToStore, setMessagesToRead,
  updateMessagesReadByOther
} from "./reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const MARK_MESSAGES_READ = "MARK_MESSAGES_READ";
const UPDATE_READ_MESSAGES = "UPDATE_READ_MESSAGES"

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  return {
    type: SET_MESSAGE,
    payload: { message, sender: sender || null },
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

// Marks messages read by current user to 'read'
export const markMessagesRead = (conversationId) => {
  return {
    type: MARK_MESSAGES_READ,
    payload: { conversationId },
  };
};

// Update reading status of messages read by another user.
export const updateReadMessages = (conversationId, lastReadMessageId) => {
  return {
    type: UPDATE_READ_MESSAGES,
    payload: { conversationId, lastReadMessageId },
  };
};


// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return action.conversations.map(convo => {
        convo.unreadMessagesCount = convo.messages
          .filter(message =>
            message.senderId === convo.otherUser.id 
            && message.readAt === null).length;
        return convo;
      });

    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);

    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );

    case MARK_MESSAGES_READ:
      return setMessagesToRead(
        state,
        action.payload.conversationId
      );

    case UPDATE_READ_MESSAGES:
      return updateMessagesReadByOther(
        state,
        action.payload.conversationId,
        action.payload.lastReadMessageId
      );
    
    default: return state;
  }
};

export default reducer;
