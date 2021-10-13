const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

User.hasMany(Conversation);
Conversation.belongsToMany(User, { through: 'ConversationParticipations' });
User.belongsToMany(Conversation, { through: 'ConversationParticipations' });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Message.hasMany(User, { through: 'readBy' });
User.hasMany(Message, { through: 'readBy' });

module.exports = {
  User,
  Conversation,
  Message
};
