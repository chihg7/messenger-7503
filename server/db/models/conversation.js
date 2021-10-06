const { Op } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids

Conversation.findConversation = async function (convoId) {
  const conversation = await Conversation.findOne({
      where: { id: convoId },
      include: User
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
