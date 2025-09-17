import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class conversationModel{
    static async createconversation(data){
        try {
            console.log(data)
            const conversation= await prisma.conversations.create({
            data:{      
                 UserId:Number(data.userId),
                 Title: data.name
            }
        })
        return conversation;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
    static async getconversationById(id){
        try {
            const conversation= await prisma.conversations.findMany({
            where:{
                UserId:id
            }
        })
        return conversation;
        }
        catch (error) {
            console.log(error)
            return error;
        }
    }
    static async getAllconversations(){
        try {
            const conversations= await prisma.conversations.findMany();
            return conversations;
        } catch (error) {
            return error;
        }   
    }
    static async updateconversation(id, data){
        try {
            console.log(data)
            const conversation= await prisma.conversations.update({
            where:{
                Id:id   
            },
            data:{
                ...data
            }
        })
        return conversation;
        }
        catch (error) {
            return error;
        }
    }
    static async deleteconversation(id){
        try {

            await prisma.chats.deleteMany({
                where:{
                    ConversationId:id
                }
            })

            await prisma.conversationSummaries.deleteMany({
                where:{
                    ConversationId:id
                }
            })

            const conversation= await prisma.conversations.delete({
            where:{
                Id:id
            }
        })
        return conversation;
        }
        catch (error) {
            console.log(error)
            return error;
        }
    }

}

export default conversationModel;