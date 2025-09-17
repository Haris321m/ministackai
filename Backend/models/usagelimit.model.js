import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UsageLimitModel {
    static async createUsageLimit(data){
        try {
            const usageLimit= await prisma.usageLimits.create({
            data:{      
                ...data
            }
        })
        return usageLimit;
        } catch (error) {
            return error;
        }
    }
    static async getUsageLimitById(id){
        try {
            const usageLimit= await prisma.usageLimits.findUnique({
            where:{
                id:id
            }
        })
        return usageLimit;
        }
        catch (error) {
            return error;
        }
    }
    static async getAllUsageLimits(){
        try {
            const usageLimits= await prisma.usageLimits.findMany();
            return usageLimits;
        } catch (error) {
            return error;
        }
    }
    static async updateUsageLimit(id, data){
        try {
            const usageLimit= await prisma.usageLimits.update({
            where:{
                id:id
            },
            data:{
                ...data
            }
        })
        return usageLimit;
        }
        catch (error) {
            return error;
        }
    }
    static async deleteUsageLimit(id){
        try {
            const usageLimit= await prisma.usageLimits.delete({
            where:{
                id:id   
            }
        })
        return usageLimit;
        }
        catch (error) {
            return error;
        }
    }
}

export default UsageLimitModel;