import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendMail(to,name) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try
  {const info = await transporter.sendMail({
    from: '"HealthTrack Team" <no-reply@healthtrack.com>',
    to,
    subject: `Welcome to HealthTrack, ${name}! 🚀`,
    text: `Hello ${name}, 

Welcome to HealthTrack! 🎉 We’re excited to have you on board.  
With HealthTrack, you can easily log your workouts, monitor your nutrition, and track your progress — all in one place.  

Stay consistent, and we’ll help you achieve your fitness goals step by step. 💪  

Cheers,  
The HealthTrack Team`,

    html: `
    <h2>👋 Hello ${name},</h2> `,
  });
console.log("Message sent: %s", info.messageId);
}
  catch(error){
    console.log("error sending email",error)
  }


  
}

