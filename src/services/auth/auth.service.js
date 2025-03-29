import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Otp from "../../models/otp.model.js";
import validator from "validator";

import geoip from "geoip-lite";
import satelize from "satelize";

import User from "../../models/user.model.js";
import { STATUS_CODES } from "../../utils/enums.js";
import {
  MAX_OTP_ATTEMPTS,
  MAX_RESEND_OTP_ATTEMPTS,
  OTP_EXPIRY,
  RESEND_COOLDOWN,
} from "./constants/otp.js";
import resend from "../../config/resend.js";
import { generateToken } from "../../utils/jwt.js";
import mongoose from "mongoose";
import axios from "axios";

dotenv.config();

async function sendOtp(emailId) {
  console.log(" called otp send");
  if (!emailId || !validator.isEmail(emailId)) {
    return {
      success: false,
      message: "Invalid email or email is required",
      status: STATUS_CODES.BAD_REQUEST,
    };
  }
  const [recentOtps, existingUser] = await Promise.all([
    Otp.find({ email: emailId, createdAt: { $gte: Date.now() - OTP_EXPIRY } }),
    User.findOne({ email: emailId }),
  ]);

  if (recentOtps.length >= MAX_OTP_ATTEMPTS) {
    return {
      success: false,
      message: "Too many OTP requests. Please try again later.",
      status: STATUS_CODES.GATEWAY_TIMEOUT,
    };
  }

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
  console.log("sending otp to email", emailId);
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
    const user = new User({
      email: emailId,
    });
    await user.save();
  }

  if (response) {
    return {
      success: true,
      otpId: otpVerify._id,
      message: "OTP sent successfully",
      status: !existingUser ? STATUS_CODES.CREATED : STATUS_CODES.OK,
    };
  } else {
    return {
      success: false,
      message: "Failed to send email",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}

async function resendOtp(emailId) {
  if (!emailId || !validator.isEmail(emailId)) {
    return {
      success: false,
      status: STATUS_CODES.BAD_REQUEST,
      message: "Invalid email or email is required",
    };
  }

  const existingOtpRecord = await Otp.findOne({ email: emailId });

  if (!existingOtpRecord) {
    return {
      success: false,
      status: STATUS_CODES.NOT_FOUND,
      message: "No previous OTP request found for this email",
    };
  }

  const timeSinceLastOtp = Date.now() - existingOtpRecord.createdAt;
  console.log(timeSinceLastOtp);
  if (timeSinceLastOtp < RESEND_COOLDOWN) {
    return {
      success: false,
      status: STATUS_CODES.TOO_MANY_REQUESTS,
      message: `Please wait ${Math.ceil(
        (RESEND_COOLDOWN - timeSinceLastOtp) / 1000
      )} seconds before requesting a new OTP`,
    };
  }

  if ((existingOtpRecord.resendAttempts || 0) >= MAX_RESEND_OTP_ATTEMPTS) {
    return {
      success: false,
      status: STATUS_CODES.SERVICE_UNAVAILABLE,
      message:
        "Maximum resend attempts exceeded. Please start a new OTP request.",
    };
  }

  const newOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const saltRounds = 10;
  const hashedOtp = await bcrypt.hash(newOtp, saltRounds);

  existingOtpRecord.otp = hashedOtp;
  existingOtpRecord.createdAt = Date.now();
  existingOtpRecord.expiresAt = Date.now() + OTP_EXPIRY;
  existingOtpRecord.attempts = 0;
  existingOtpRecord.resendAttempts =
    (existingOtpRecord.resendAttempts || 0) + 1;

  await existingOtpRecord.save();

  const emailResponse = await resend.emails.send({
    from: "Inspect Track Support <noreply@baple.in>",
    to: emailId,
    subject: "Your New Verify OTP",
    html: `<p>Dear Inspect Track User</p>
            <p>Your new One-Time Password (OTP) for Inspect Track is: <h2>${newOtp}</h2></p>
            <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
            <p><small>This is a resent OTP. Previous OTP is now invalid.</small></p>
            <p>Best regards,<br>Inspect Track Team</p>`,
  });

  if (emailResponse) {
    return {
      success: true,
      status: STATUS_CODES.OK,
      message: "New OTP sent successfully",
      otpId: existingOtpRecord._id,
    };
  } else {
    return {
      success: false,
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: "Failed to resend OTP",
    };
  }
}

async function getLocationByIpAddress(lat, long) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng= ${lat},${long}&result_type=street_address&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  console.log("google map response: ", response);

  if (response && response.data.status === "OK") {
    return response.data.results[0].formatted_address;
  } else {
    return "No address found";
  }
}

async function verifyOtp(req, otpId, otp, lat, long) {
  if (!otpId || !otp) {
    return {
      success: false,
      status: STATUS_CODES.NOT_FOUND,
      message: "OTP ID and OTP are required",
    };
  }
  const mongooseOtpId = new mongoose.Types.ObjectId(otpId);
  const otpRecord = await Otp.findById(mongooseOtpId);
  if (!otpRecord) {
    return {
      success: false,
      status: STATUS_CODES.NOT_FOUND,
      message: "Invalid OTP request",
    };
  }

  const userEmail = otpRecord.email;

  const existingUser = await User.findOne({ email: userEmail });
  existingUser.formattedAddress = await getLocationByIpAddress(lat, long);
  console.log("got address", existingUser.address);
  await existingUser.save();

  if (Date.now() > otpRecord.expiresAt) {
    await Otp.findByIdAndDelete(otpId);

    return {
      success: false,
      status: STATUS_CODES.NOT_FOUND,
      message: "OTP expired",
    };
  }
  otpRecord.attempts += 1;
  await otpRecord.save();

  if (otpRecord.attempts > MAX_OTP_ATTEMPTS) {
    await Otp.findByIdAndDelete(otpId);
    return {
      success: false,
      status: STATUS_CODES.SERVICE_UNAVAILABLE,
      message: "Max verification attempts exceeded",
    };
  }
  const isMatch = await bcrypt.compare(otp, otpRecord.otp);
  if (!isMatch) {
    return {
      success: false,
      status: STATUS_CODES.BAD_REQUEST,
      message: "Invalid OTP",
    };
  }

  let user = await User.findOne({ email: otpRecord.email });
  const isNewUser = user === null;
  if (!user && isNewUser) {
    const newUser = new User({
      email: otpRecord.email,
    });
    await newUser.save();
  }
  await Otp.findByIdAndDelete(otpId);

  return {
    success: true,
    status: isNewUser ? STATUS_CODES.CREATED : STATUS_CODES.OK,
    message: "OTP verified",
    accessToken: generateToken(user.id, otpRecord.email, 7),
    refreshToken: generateToken(user.id, otpRecord.email, 30),
    isNewUser: isNewUser,
  };
}

async function getUserProfile(userId) {
  const user = await User.findOne({
    _id: userId,
  });

  if (user) {
    return {
      status: STATUS_CODES.OK,
      message: "User profile fetched successfully",
      userEmail: user.email,
      address: user.formattedAddress,
    };
  }
  return {
    status: STATUS_CODES.NOT_FOUND,
    message: "User not found",
  };
}
export default { sendOtp, verifyOtp, resendOtp, getUserProfile };
