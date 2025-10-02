import otpmodel from "../models/otp.model.js";
import user from "../models/user.model.js";
import sendOtpEmail from "../utils/nodemailer.utils.js"

function generator() {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
}




async function createotp(req, res) {
    try {
        console.log(req.body);
          const data=req.body;
          data.Otp=generator();
        const otp =await otpmodel.createotp(data)
         
        const sent = await sendOtpEmail(data.Email,otp)
        if(sent){
            res.json({message:"OTP sent to your email", "success": true})
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP" });
    }
}

async function updateotp(req,res){
    try {
        console.log(req.body);
        let data=req.body;
        data.Otp = generator()
        const otp =await otpmodel.updateotp(data)
         
        const sent = await sendOtpEmail(data.Email,otp.Otp)
        if(sent){
            res.json({message:"OTP sent to your email"})
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP" });
    }
}

async function checkOtp(req, res) {
  try {
    console.log(req.body)
    const {Email, Otp } = req.body;
    let data ={
      Email,
      Otp
    }
    const sotp = await otpmodel.readotp(data);

    if (!sotp) {
      return res.status(404).json({ message: "OTP not found" });
    }

   
    const now = new Date();
    const expiryTime = new Date(sotp.CreatedAt);
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);

    if (now > expiryTime) {
      console.log("expire")
      return res.status(400).json({ message: "OTP expired" });
    }

    
    if (sotp.Otp !== Otp) {
      console.log("not matched")
      return res.status(400).json({ message: "Invalid OTP" });
    }

    
     data = {
      FirstName: sotp.FirstName,
      LastName: sotp.LastName,
      Email: sotp.Email,
      Password: sotp.PasswordHash
    };
    console.log(data)
    await user.createuser(data);

    return res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function createforgetotp(req, res) {
    try {
        console.log(req.body);
          const data=req.body;
          const found=await user.getuserByEmail(data.Email)
          console.log(found)
          if(!found){
            res.status(404).json({message:"Email not found"})
          }
          data.Otp=generator();
        const otp =await otpmodel.createotp(data)
         
        const sent = await sendOtpEmail(data.Email,otp)
        if(sent){
            res.json({message:"OTP sent to your email", "success": true})
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to send OTP" });
    }
}


async function forgetOtp(req, res) {
  try {
    const { Otp } = req.body;
    const sotp = await otpmodel.readotp(req.body);

    if (!sotp) {
      return res.status(404).json({ message: "OTP not found" });
    }

   
    const now = new Date();
    const expiryTime = new Date(sotp.CreatedAt);
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);

    if (now > expiryTime) {
      return res.status(400).json({ message: "OTP expired" });
    }

    
    if (sotp.Otp !== Otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({message:"otp check and verified", success:true})

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}



export default {
    checkOtp,
    createotp,
    updateotp,
    forgetOtp,
    createforgetotp
}
