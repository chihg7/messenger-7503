// Utility functions for conversations reducer

export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  /** 
    1. if sender isn't null, that means the message needs to be put in a brand new convo;
    2. It also means the message is coming from another user, so the unreadMessagesCount
    is to be set to 1.
    3. I opted not to check if this message is for an active chat and then mark it as unread
    right away but instead let it first emerge as an unread message and then if the current 
    user is indeed on this chat, the active chat component will mark it as unread.
    I felt this is more logical from the point of real life information exchange, also it
    elimanates the possible glitch that can be caused when the user happens to be clicking
    away right when the process has decided that the chat is still active.
   */

  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessagesCount: 1
    };
    newConvo.latestMessageText = message.text;
    return [...state, newConvo];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId ||
        convo.otherUser.id === message.senderId)
    {
      const newConvo = {...convo};
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;

      // Decide if to increment unread count by checking if message is from 
      // the current user. If we were to implement multi-user conversations, 
      // I think it would be more efficient to require another parameter for 
      // identifying the current user.
      if (convo.otherUser.id === message.senderId)
        newConvo.unreadMessagesCount++;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};


export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    // sync newly created convo with a fakeConvo which has no conversation ID 
    // and is created when the other user is on the search list.
    if (convo.otherUser.id === recipientId) {
      const newConvo = {...convo};
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const setMessagesToRead = (state, conversationId) =>
{
  // The initial design was to update the reading status of each updated 
  // message according to [updatedMessages], but I resorted to just 
  // setting all unread messages to 'read' due to cost concern.
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const newConvo = { ...convo };
      newConvo.messages.forEach((message) => {
        if (message.readAt === null)
          message.readAt = "read";
      });
      newConvo.unreadMessagesCount = 0;
      return newConvo;
    } else {
      return convo;
    }
  });
}

export const updateMessagesReadByOther = (
  state, conversationId, lastReadMessageId) =>
{
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const newConvo = { ...convo };
      newConvo.lastReadMessageId = lastReadMessageId;
      return newConvo;
    } else {
      return convo;
    }
  });
};