import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class chatsModel {
    static async createChat(data){
        try {
            const chat= await prisma.chats.create({
            data:{      
                UserId:Number(data.userId),
                CurrentModelId:Number(data.modelid),
                ConversationId:Number(data.conversationid),
                ChatName:data.chatname,
                UserQuestion:data.userquestion,
                BotAnswer:data.BotAnswer,
                BotImages:data.BotImages
            }
        })
        return chat;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
    static async getChatById(id){
        try {
            const chat= await prisma.chats.findMany({
            where:{
                ConversationId:id
            }
        })
        return chat;
        }
        catch (error) {
            return error;
        }
    }
    static async getAllChats(){
        try {
            const chats= await prisma.chats.findMany();
            return chats;
        } catch (error) {
            return error;
        }
    }
    static async updateChat(id, data){
        try {
            const chat= await prisma.chats.update({
            where:{
                id:id
            },
            data:{
                ...data
            }
        })
        return chat;
        }
        catch (error) {
            return error;
        }
    }
    static async deleteChat(id){
        try {
            const chat= await prisma.chats.delete({
            where:{
                id:id
            }
        })
        return chat;
        } catch (error) {
            return error;
        }
    }
    static async deleteconversationChat(id){
        try {
            const chat= await prisma.chats.deleteMany({
            where:{
                ConversationId:id
            }
        })
        return chat;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
}
export default chatsModel;