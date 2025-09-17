import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (to, name) => {
  try {
    const msg = {
      to,
      from: process.env.MAIL_FROM,
      subject: "Welcome to HealthTrack 🎉",
      text: `Hi ${name},  

Thank you for registering with **HealthTrack**! 🎉  
We’re excited to support you on your journey toward a fitter, healthier life.  

With HealthTrack, you’ll have guidance at every step — whether it’s tracking your workouts, monitoring progress, or staying motivated.  

Let’s get started on building a stronger and healthier you! 💪`,
      html: `<p>Hi <b>${name}</b>, welcome to <b>HealthTrack</b> 🎉</p>`,
    };

    const res = await sgMail.send(msg);
    console.log("✅ Email sent:", res[0].statusCode);
  } catch (err) {
    console.error("❌ Email error:", err.response?.body || err.message);
  }
};
