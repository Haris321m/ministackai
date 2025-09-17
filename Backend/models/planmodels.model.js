import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


class planmodels{
    static async  createplanmodels(data) {

        await prisma.PlanModels.create({
            data:{
                ...data
            }
        })
        
    }
    static async deleteplanmodels(data){
        await prisma.planmodels.update({
            where:{
                Id:data.id
            }
        })
    }
}

export default planmodels;

