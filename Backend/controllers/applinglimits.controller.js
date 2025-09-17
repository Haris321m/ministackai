import planmodel from "../models/plan.model.js";
import usagemodel from "../models/usagelogs.model.js";
import UserPlanModel from "../models/userplan.model.js";
import userModel from "../models/user.model.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// helper: date ko dd-mm-yyyy me format karne ke liye
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); 
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

async function getAllUsersPlanReport(req, res) {
  try {
    const users = await userModel.getAllUsers();
    let report = [];

    for (const user of users) {
      const userPlan = await UserPlanModel.getUserPlanByUserId(user.Id);
     
      if (!userPlan) continue;
        
      const plan = await planmodel.getPlanByplanId(userPlan.PlanId);
      if (!plan) continue;

      const usage = await usagemodel.getUsageLogByUserId(user.Id);
      
      const tokensUsed = usage ? usage._sum.TokensUsed : 0;
      const tokensRemaining = plan.TokensLimit - tokensUsed;
      
      const startDate = new Date(userPlan.StartAt);
      const today = new Date();

      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const durationDays = plan.DurationDays;
      const remainingDays = durationDays - diffDays;

      report.push({
        userId: user.Id,
        userName: user.Name,
        planName: plan.Name,
        tokensUsed: tokensUsed,
        tokensRemaining: tokensRemaining,
        planStartDate: formatDate(startDate), 
        daysPassed: diffDays,
        remainingDays: remainingDays < 0 ? 0 : remainingDays,
      });
    }

    res.status(200).json({ report });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      error: "Failed to fetch users plan report",
      details: error.message,
    });
  }
}


async function userfileupload(req, res) {
  try {
    const { id } = req.params;

    console.log("id of user",id)
    const user =await userModel.getuserById(id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user)

    const filePath = `/uploads/${req.file.filename}`;


    const newImage = await prisma.UserImages.create({
      data: {
        ImageUrl: filePath,
        UserId: user.Id,
      },
    });

    res.json({
      message: "File uploaded & stored successfully",
      userId: user.id,
      image: newImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function userpayment(req,res) {
    try {
    const users = await prisma.users.findMany({
      include: {
        UserImages: true, 
      },
    });

    const result = users.map((u) => ({
      id: u.Id,
      firstName: u.FirstName,
      lastName: u.LastName,
      email: u.Email,
      paymentProofs: u.UserImages.map((img) => ({
        id: img.Id,
        imageUrl: img.ImageUrl,
        uploadedAt: img.UploadedAt,
      })),
    }));

    res.json({ users: result });
  } catch (error) {
    console.error("Error fetching users with verification:", error);
    res.status(500).json({ error: error.message });
  }
}

async function deletepayment(req,res) {
   try {
    const {id} = req.params;
    const payment = await prisma.UserImages.delete(
      {
        where:{
          Id:Number(id)
        }
      }
    )

    res.status(200).json({
      message:"the payment was deleted",
      data:payment
    })

   } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
   }
}



export default { getAllUsersPlanReport , userfileupload , userpayment ,deletepayment };
