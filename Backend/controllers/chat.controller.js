import chatsModel from "../models/chats.model.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// chatController.js
async function createChatData(chatData) {
  // chatData = { userId, modelid, conversationid, chatname, userquestion, modelanswer }
  try {
    // Example using Prisma
    const chat = await chatsModel.createChat(chatData);
    return chat;
  } catch (err) {
    console.error("Failed to create chat:", err.message);
    throw err;
  }
}

// Express route handler
export async function createChat(req, res) {
  try {
    const chat = await chatsModel.createChat(req.body);
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


function getChatById(req, res) {
    const id = parseInt(req.params.id, 10);
    chatsModel.getChatById(id)
        .then((chat) => {
            if (chat) {
                res.status(200).json(chat);
            } else {
                res.status(404).json({ error: 'Chat not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve chat', details: error.message });
        }
    );
}

function getAllChats(req, res) {
    chatsModel.getAllChats()
        .then((chats) => {
            res.status(200).json(chats);
        }
        ).catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve chats', details: error.message });
        }
    );
}

function updateChat(req, res) {
    const id = parseInt(req.params.id, 10);
    const data = req.body;
    chatsModel.updateChat(id, data)
        .then((chat) => {
            if (chat) {
                res.status(200).json(chat);
            } else {
                res.status(404).json({ error: 'Chat not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update chat', details: error.message });
        }
    );
}

function deleteChat(req, res) {
    const id = parseInt(req.params.id, 10);
    chatsModel.deleteChat(id)
        .then((chat) => {
            if (chat) {
                res.status(200).json({ message: 'Chat deleted successfully' });
            } else {
                res.status(404).json({ error: 'Chat not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete chat', details: error.message });
        }
    );
}

async function getMessagesByConversation(conversationId) {
  return await prisma.chats.findMany({
    where: { ConversationId : conversationId },
    orderBy: { CreatedAt: "asc" }, 
    select: {
      UserQuestion: true,
      BotAnswer: true,
    },
  });
}

export default {
    createChat,
    getChatById,
    getAllChats,
    updateChat,
    deleteChat,
    createChatData,
    getMessagesByConversation
};