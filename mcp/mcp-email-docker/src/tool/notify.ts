import { z } from "zod";
import nodemailer from "nodemailer";

export const notifySchema = z.object({
  method: z.enum(["email", "sms"]),
  to: z.string().email(),
  content: z.string(),
});

export const sendNotification = async ({ method, to, content }: z.infer<typeof notifySchema>) => {
  if (method === "email") {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },

    });

    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "云野智能体自动推送",
      text: content,
    });
    if(result.accepted.length > 0) {
      console.info("邮件发送成功");
    }
    else {
      console.error("邮件发送失败", result.rejected);
    }
  }
  else
    throw new Error("不支持的通知方式");
};