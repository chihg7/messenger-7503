const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, QueryTypes } = require("sequelize");
const db = require("../../db");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // find the latest message read by the other user
      console.log("convo ID: " + convoJSON.id);
      const result = await Message.findOne({
        where: { 
          conversationId: convoJSON.id,
          senderId: userId,
          readAt: { [Op.not]: null }
        },
        order: [[ 'createdAt', 'DESC' ]],
      });

      const lastReadMessageId = result ? result.dataValues.id : null;

      // set properties for notification count and latest message preview
      convoJSON.lastReadMessageId = lastReadMessageId;
      convoJSON.latestMessageText = convoJSON.messages[0].text;
      convoJSON.messages = convoJSON.messages.reverse(); 
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// Set all messages unread by the user to read
router.put("/read/:conversationId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const { conversationId } = req.params;

    const { dataValues: convo } = 
      await Conversation.findOne({ where: { id: conversationId }});

    if (!(convo.user1Id === userId || convo.user2Id === userId)) {
      return res.sendStatus(403);
    }   
    
    const updateResult = await db.query(
      'UPDATE messages SET "readAt" = current_timestamp ' +
      'WHERE "conversationId" = $conversationId AND "readAt" IS NULL ' +
      'AND NOT "senderId" = $userId;',
      {
        bind: { conversationId: conversationId, userId: userId },
        type: QueryTypes.UPDATE
      }
    );
    
    const {dataValues: lastReadMessage} = await Message.findOne({
      where: { 
        conversationId: conversationId,
        [Op.not]: {
          readAt: null,
          senderId: userId
        }
      },
      order: [[ 'createdAt', 'DESC' ]],
    });

    res.json({
      numOfRowsUpdated: updateResult[1],
      lastReadMessageId: lastReadMessage.id,
      readerId: userId
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
