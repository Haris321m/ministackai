import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class Models {
    static async createModel(data){
        try {
            const model= await prisma.models.create({
            data:{      
                ...data 
            }
        })
        return model;
        } catch (error) {
            console.log(error)
            return error;
        }   
    }
    static async getModelById(id){
        try {
            const model= await prisma.models.findMany({
            where:{
                Id:Number(id)
            }
        })
        return model;
        } catch (error) {
            return error;
        }   
    }
    static async getAllModels(){
        try {
            const models= await prisma.models.findMany();
            return models;
        } catch (error) {
            return error;
        }
    }
    static async updateModel(id, data){
        try {
            const model= await prisma.models.update({
            where:{
                id:id
            },
            data:{
                ...data
            }
        })
        return model;
        } catch (error) {
            return error;
        }
    }
    static async deleteModel(id){
        try {

            await prisma.usageLogs.deleteMany({
                where:{
                    ModelId:id
                }
            })

            const model= await prisma.models.delete({
            where:{
                Id:id

            }
        })

        return model;
        } catch (error) {
            console.log(error)
            return error;
        }
    }
}
export default Models;