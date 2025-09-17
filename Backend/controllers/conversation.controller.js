import conversationModel from "../models/conversation.model.js";
import chatsmodel from "../models/chats.model.js";

function createconversation(req, res) {
    const data = req.body;
    conversationModel.createconversation(data)
        .then((newC) => {
            res.status(201).json(newC);
        }
        ).catch((error) => {
            res.status(500).json({ error: 'Failed to create conversation', details: error.message });
        }
    );
}

function getconversationById(req, res) {
    const id = parseInt(req.params.id, 10);
    conversationModel.getconversationById(id)
        .then((conversation) => {
            if (conversation) {
                res.status(200).json(conversation); 
            } else {
                res.status(404).json({ error: 'Conversation not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve conversation', details: error.message });
        }
    );
}

function getAllconversations(req, res) {
    conversationModel.getAllconversations()
        .then((conversations) => {
            res.status(200).json(conversations);
        }
        ).catch((error) => {
            res.status(500).json({ error: 'Failed to retrieve conversations', details: error.message });
        }
    );
}

function updateconversation(req, res) {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    conversationModel.updateconversation(id, data)
        .then((conversation) => {
            if (conversation) {
                res.status(200).json(conversation);
            } else {
                res.status(404).json({ error: 'Conversation not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to update conversation', details: error.message });
        }
    );
}

function deleteconversation(req, res) {
    const id = parseInt(req.params.id, 10);
    chatsmodel.deleteconversationChat(id)
    conversationModel.deleteconversation(id)
        .then((conversation) => {
            if (conversation) {
                res.status(200).json({ message: 'Conversation deleted successfully' });
            } else {
                res.status(404).json({ error: 'Conversation not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Failed to delete conversation', details: error.message });
        }
    );
}

export default {
    createconversation,
    getconversationById,
    getAllconversations,
    updateconversation,
    deleteconversation
};