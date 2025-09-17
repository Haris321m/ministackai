// models/usagelogs.model.js
import {PrismaClient} from "@prisma/client";

const  prisma=new PrismaClient();

class usagelogsModel {
  static async findOne({ userId, mId }) {
    return prisma.usageLogs.findFirst({
      where: { UserId:Number(userId), ModelId:mId },
    });
  }
  static async createUsageLog(data) {
    return prisma.usageLogs.create({ data:{
      UserId:Number(data.userId), 
      ModelId:data.mId,
      TokensUsed:data.TokensUsed,
      ImagesGenerated:data.ImagesGenerated
    } });
  }
  static async updateUsageLog(id, data) {
    console.log(data)
    return prisma.usageLogs.update({
      where: { Id:id },
      data:{
        TokensUsed:data.tokensUsed ,
        ImagesGenerated:data.ImagesGenerated
      },
    });
  }
  static async getUsageLogById(id) {
    return prisma.usageLogs.findUnique({ where: { id } });
  }

  static async getUsageLogByUserId(id) {
    // Use aggregation to sum all TokensUsed values
    try {
        return prisma.usageLogs.aggregate({
          _sum: {
            TokensUsed: true,
            ImagesGenerated: true
          },
          where: {
            UserId: id
          }
        });
        
    } catch (error) {
      console.log(error)
        return error;
    }
  }


  static async getAllUsageLogs() {
    return prisma.usageLogs.findMany();
  }
  static async deleteUsageLog(id) {
    return prisma.usageLogs.delete({ where: { id } });
  }
};


export default usagelogsModel;