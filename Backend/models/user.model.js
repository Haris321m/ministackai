import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();


class UserModel {
    static async createuser(data) {
    try {
        // Password hash
        data.PasswordHash = await hash(data.password, 10);

        // Step 1: User create karo
        const user = await prisma.users.create({
            data: {
                FirstName: data.FirstName,
                LastName: data.LastName,
                Email: data.Email,
                PasswordHash: data.PasswordHash,
                Role: data.Role || 'user',
            }
        });

        
        const freePlan = await prisma.plans.findFirst({
            where: { Price: 0.0 }
        });

       
        if (freePlan) {
            await prisma.userPlans.create({
                data: {
                    UserId: user.Id,
                    PlanId: freePlan.Id,
                    StartDate: new Date(),
                    
                }
            });
        }

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

    static async getuserByEmail(email){
        try {
            const user= await prisma.users.findUnique({
            where:{
                Email:email
            }
        })
        return user;
        } catch (error) {
            return error;
        }
    }
    static async getuserById(id){
        try {
            const user= await prisma.users.findUnique({
            where:{
                Id:Number(id)
            }
        })
        return user;
        } catch (error) {
            return error;
        }
    }
    static async getAllUsers(){
        try {
            const users= await prisma.users.findMany();
            return users;
        } catch (error) {
            return error;
        }
    }
    static async updateUser(id, data){
        try {
            
            if(data.PasswordHash){
                data.PasswordHash= await hash(data.PasswordHash, 10);
            }
            const user= await prisma.users.update({
            where:{
                Id:Number(id)
            },
            data:{
                FirstName:data.FirstName,
                LastName:data.LastName,
                Email:data.Email,
                PasswordHash : data.PasswordHash,
                Role : data.Role
            }
        })
        return user;
        }
        catch (error) {
            console.log(error)
            return error;
        }
    }
    static async deleteUser(id) {
    try {
        console.log("Model deleting user with id:", id);
        
        await prisma.chats.deleteMany({
            where: { UserId: Number(id) }
        });

        // 1. Delete all conversations for this user
        await prisma.conversations.deleteMany({
            where: { UserId: Number(id) }
        });

        await prisma.userLimits.deleteMany({
            where:{
                UserId: Number(id)
            }
        })

        await prisma.usageLogs.deleteMany({
            where:{ UserId : Number(id) }
        })

        await prisma.billingHistory.deleteMany({
            where : { UserId : Number(id) }
        })

        // 2. Now delete the user
        const user = await prisma.users.delete({
            where: { Id: Number(id) }
        });

        console.log("Deleted user:", user);
        return user;
    } catch (error) {
        console.error("Error deleting user:", error);
        return error;
    }
    }

    static async getUserByResetToken(resetToken){
        try {
            const user= await prisma.users.findUnique({
            where:{
                resetToken:resetToken
            }
        })
        return user;
        } catch (error) {
            return error;
        }
    }
        static async loginUser(email) {
    try {
        // Step 1: Get user
        const user = await prisma.users.findUnique({
        where: { Email: email },
        });

        if (!user) {
        return null; // user not found
        }

        // Step 2: Get active plans
        const plans = await prisma.userPlans.findMany({
        where: {
            UserId: user.Id,
            Status: "active",
        },
        });

        let planSubscribed = "false";

        if (plans.length > 0) {
        // Step 3: Pick first active plan (maan lo ek hi hota hai)
        const activePlan = plans[0];

        // Step 4: Check expiry
        if (activePlan.EndAt && new Date() < activePlan.EndAt) {
            planSubscribed = "true"; // abhi tak valid hai
        } else {
            // Plan expire ho gaya
            planSubscribed = "false";

            // Step 5: Update DB status to "expired"
            await prisma.userPlans.update({
            where: { Id: activePlan.Id },
            data: { Status: "expired" },
            });
        }
        }

        // Step 6: Attach subscription status to user object
        user.planSubscribed = planSubscribed;

        return user;
    } catch (error) {
        console.error("Login error:", error);
        return error;
    }
    }

}
export default UserModel;