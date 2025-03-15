import generateToken from "./../../utils/jwt.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Otp from "../../models/otp.model.js";
import { Resend } from "resend";
import User from "../../models/user.model.js";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOtp(emailId) {
  try {
    if (!emailId) {
      return { success: false, error: "Email is required" };
    }

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    let existingUser = await User.findOne({ email: emailId });

    const otpVerify = new Otp({
      email: emailId,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });

    await otpVerify.save();

    const response = await resend.emails.send({
      from: "Inspect Track Support <noreply@baple.in>",
      to: emailId,
      subject: "Verify OTP",
      html: `<p>Dear Inspect Track User</p>
                <p>Your One-Time Password (OTP) for Inspect Track is: <h2>${otp}</h2></p>
                <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>

                <p>Best regards,<br>Inspect Track Team</p>`,
    });

    if (!existingUser) {
      try {
        const user = new User({
          email: emailId,
        });
        await user.save();
      } catch (userError) {
        console.error("Error creating user:", userError);
      }
    }

    if (response) {
      return { success: true, otpId: otpVerify._id };
    } else {
      return { success: false, error: "Failed to send email" };
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: error.message || "Something went wrong" };
  }
}

async function verifyOtp(otpId, otp) {
  try {
    if (!otpId || !otp) {
      return {
        success: false,
        status: 400,
        message: "OTP ID and OTP are required",
      };
    }

    const otpRecord = await Otp.findById(otpId);
    if (!otpRecord) {
      return { success: false, status: 400, message: "Invalid OTP request" };
    }

    if (Date.now() > otpRecord.expiresAt) {
      await Otp.findByIdAndDelete(otpId);
      return { success: false, status: 400, message: "OTP expired" };
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return { success: false, status: 400, message: "Invalid OTP" };
    }

    await Otp.findByIdAndDelete(otpId);

    const user = await User.findOne({ email: otpRecord.email });
    if (user) {
      return {
        success: true,
        status: 200,
        message: "User exists, OTP verified",
        token: generateToken(user.id, otpRecord.email),
      };
    } else {
      const newUser = new User({
        email: otpRecord.email,
      });
      await newUser.save();
      return {
        success: true,
        status: 201,
        message: "OTP verified, created new user",
        token: generateToken(user.id, otpRecord.email),
      };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      status: 500,
      message: error.message || "Something went wrong",
    };
  }
}

export default { sendOtp, verifyOtp };
