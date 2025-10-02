import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",   
  port: 465,                     
  secure: true,                  
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS       
  }
});

/**
 * Send OTP Email
 * @param {string} toEmail 
 * @param {string} otp 
 */
async function sendOtpEmail(toEmail, otp) {
  try {
    const info = await transporter.sendMail({
      from: '"MiniSmart AI" <team@minismartai.com>', 
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in <b>5 minutes</b>.</p>`
    });

    console.log(" Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error(" Error sending email:", error);
    return false;
  }
}

export default  sendOtpEmail ;
