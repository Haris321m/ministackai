import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserPlanModel {
  static async createUserPlan(data) {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 30); 

      const userplan = await prisma.userPlans.create({
        data: {
          ...data,
          StartAt: startDate,
          EndAt: endDate,
          Status: "active",
        },
      });
      return userplan;
    } catch (error) {
      return error;
    }
  }

  static async getUserPlanByUserId(userId) {
    try {
      const userPlan = await prisma.userPlans.findFirst({
        where: { UserId: userId, Status: "active" },
        include: {
          Plans: {
            include: {
              PlanModels: {
                include: {
                  Models: true,
                },
              },
            },
          },
        },
      });

      if (!userPlan) return null;

      
      if (userPlan.EndAt && new Date() > userPlan.EndAt) {
        await prisma.userPlans.update({
          where: { Id: userPlan.Id },
          data: { Status: "expired" },
        });
        return null;
      }

      
      const models = userPlan.Plans.PlanModels.map((pm) => ({
        Id: pm.Models.Id,
        Name: pm.Models.Name,
      }));

      const result = {
        ...userPlan,
        Plan: {
          ...userPlan.Plans,
          Models: models,
        },
      };

      delete result.Plans; 

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getAllUserPlans() {
    try {
      return await prisma.userPlans.findMany();
    } catch (error) {
      return error;
    }
  }

  static async updateUserPlan(id, data) {
    try {
      return await prisma.userPlans.update({
        where: { Id: id },
        data: { ...data },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async deleteUserPlan(id) {
    try {
      return await prisma.userPlans.delete({
        where: { Id: id }, 
      });
    } catch (error) {
      return error;
    }
  }
}

export default UserPlanModel;
