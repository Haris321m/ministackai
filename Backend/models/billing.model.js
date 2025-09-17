import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class billingModel {    
    static async createBilling(data){
        try {
            const billing= await prisma.billings.create({
            data:{      
                ...data 
            }
        })
        return billing;
        } catch (error) {
            return error;
        }
    }
    static async getBillingById(id){
        try {
            const billing= await prisma.billings.findUnique({
            where:{
                id:id   
            }
        })
        return billing;
        }
        catch (error) {
            return error;
        }
    }
    static async getAllBillings(){
        try {
            const billings= await prisma.billings.findMany();
            return billings;
        } catch (error) {
            return error;
        }
    }
    static async updateBilling(id, data){
        try {
            const billing= await prisma.billings.update({
            where:{
                id:id
            },
            data:{
                ...data
            }
        })
        return billing;
        } catch (error) {
            return error;
        }
    }
    static async deleteBilling(id){
        try {
            const billing= await prisma.billings.delete({
            where:{
                id:id
            }
        })
        return billing;
        } catch (error) {
            return error;
        }
    }
}
export default billingModel;