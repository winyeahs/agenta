"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.notifySchema = void 0;
const zod_1 = require("zod");
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.notifySchema = zod_1.z.object({
    method: zod_1.z.enum(["email", "sms"]),
    to: zod_1.z.string().email(),
    content: zod_1.z.string(),
});
const sendNotification = async ({ method, to, content }) => {
    if (method === "email") {
        const transporter = nodemailer_1.default.createTransport({
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
        if (result.accepted.length > 0) {
            console.info("邮件发送成功");
        }
        else {
            console.error("邮件发送失败", result.rejected);
        }
    }
    else
        throw new Error("不支持的通知方式");
};
exports.sendNotification = sendNotification;
