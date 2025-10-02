import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
const prisma = new PrismaClient();


cron.schedule("0 0 * * *", async () => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); 

    const result = await prisma.otpTable.deleteMany({
      where: {
        CreatedAt: {
          lt: cutoff, 
        },
      },
    });

    console.log(` OTP cleanup done. Deleted rows: ${result.count}`);
  } catch (error) {
    console.error("Error during OTP cleanup:", error);
  }
});