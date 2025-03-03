import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Otp from "../../models/otp.model.js";
import { Resend } from "resend";
import User from "../../models/user.model.js";
dotenv.config()
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtp(emailId) {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp, saltRounds);

        const otpVerify = new Otp({
            email: emailId,
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 600000,
        });

        await otpVerify.save();

        const response = await resend.emails.send({
            from: "Inspect Track <noreply@baple.in>",
            to: emailId,
            subject: "OTP Authentication",
            html: `<p>Dear User,</p>
                <p>Your One-Time Password (OTP) for Inspect Track is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                <p>If you did not request this code, please ignore this email.</p>
                <p>Best regards,<br>Inspect Track Team</p>`
        });

        if (response) {
            return { success: true, otpId: otpVerify._id };
        }
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, error: "Something went wrong" };
    }
}


async function verifyOtp(otpId, otp) {
    try {
        const otpRecord = await Otp.findById(otpId);
        if (!otpRecord) {
            return { success: false, status: 400, message: "Invalid OTP request" };
        }

        if (Date.now() > otpRecord.expiresAt) {
            return { success: false, status: 400, message: "OTP expired" };
        }

        const isMatch = bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) {
            return { success: false, status: 400, message: "Invalid OTP" };
        }

        const user = await User.findOne({ email: otpRecord.email });
        if (user) {
            return { success: true, status: 201, message: "User exists, OTP verified" };
        } else {
            const newUser = new User({
                email: otpRecord.email

            })
            await newUser.save()
            return { success: true, status: 200, message: "OTP verified, created new user" };
        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, status: 500, message: "Something went wrong" };
    }
}

export default { sendOtp, verifyOtp };
