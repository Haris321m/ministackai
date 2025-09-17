import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PlanModel {
    // Create plan and associate models
    static async createPlan(data) {

    const { models, ...planData } = data;

    //  Create the plan
    const newPlan = await prisma.plans.create({
        data: planData,
    });

    //  Associate models if provided
    if (models && models.length > 0) {
        const planModelsData = models.map((modelId) => ({
            PlanId: newPlan.Id,
            ModelId: Number(modelId), // convert string IDs to numbers if needed
        }));

        await prisma.planModels.createMany({
            data: planModelsData
        });
    }

    //  Fetch and return the full plan with associated models
    const planWithModels = await prisma.plans.findUnique({
        where: { Id: newPlan.Id },
        include: {
            PlanModels: {
                include: {
                    Models: true, //  must match your schema relation field
                },
            },
        },
    });

    const modelIds = planWithModels.PlanModels.map((pm) => pm.Models.Id.toString());

    return { ...planWithModels, models: modelIds };
}



    // Get plan by ID including models
    static async getPlanById(id) {
        return prisma.plans.findUnique({
            where: { Id: id },
            include: { 
                PlanModels: { 
                    include: { Model: true } 
                } 
            }
        });
    }

    static async getPlanByplanId(id) {
        return prisma.plans.findUnique({
            where: { Id: id }   
        });
    }

    // Update plan and models
    static async updatePlan(id, data) {
        const { models, ...planData } = data;

        const updatedPlan = await prisma.plans.update({
            where: { Id: id },
            data: planData
        });

        if (models) {
            // Delete old associations
            await prisma.planModels.deleteMany({ where: { PlanId: id } });

            // Insert new associations
            const planModelsData = models.map(modelId => ({
                PlanId: id,
                ModelId: modelId
            }));

            await prisma.planModels.createMany({ data: planModelsData });
        }

        return this.getPlanById(id);
    }

    static async getAllPlans() {
        return prisma.plans.findMany({
            // include: {
            //     PlanModels: { include: { Model: true } }
            // }
        });
    }

    static async deletePlan(id) {
        try {
            await prisma.planModels.deleteMany({ where: { PlanId: Number(id) } });
            await prisma.userPlans.deleteMany({where : { PlanId : Number(id) }})
            return prisma.plans.delete({ where: { Id: Number(id) } });
            
        } catch (error) {
            console.log(error)
        }
        // Delete associated models first
    }
}

export default PlanModel;
