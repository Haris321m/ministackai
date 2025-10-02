import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

class otpmodel{
    static async createotp(data){
        try {
            const otp=await prisma.otptable.create({
                data:{
                    ...data
                }}
            )
            if(!otp){
                return "The otp was created"
            }
            return otp.Otp
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async  updateotp(data){
        try {
            
            const otp= await prisma.otptable.updateMany({
                where:{
                     Email :data. Email 
                },
                data:{
                    Otp:data.Otp
                }
            })
            return otp
        } catch (error) {
            console.log(error)
            return error
        }
    } 

    static async readotp(data){
        try {
            
            const otp= await prisma.otptable.findFirst({
                where:{
                    Otp : data.Otp
                }
            })
            if(!otp){
                
                return "no otp read"
            }
            return otp
        } catch (error) {
            console.log(error)
            return error
        }
    }

    static async deleteotp(data){
        try {
            const otp=await prisma.otptable.deleteMany({
                where:{
                    Email : data.Email
                }
            })
            if(!otp){
                return "No otp deleted"
            }
            return otp
        } catch (error) {
            console.log(error)
            return error
        }
    }


}


export default otpmodel;