import authService from "../../services/auth/auth.service.js";
import { STATUS_CODES } from "../../utils/enums.js";

async function loginUser(req, res) {
  try {
    const { email } = req.body;

    const otpVerification = await authService.sendOtp(email);
    if (otpVerification && otpVerification.success) {
      res.status(STATUS_CODES.CREATED).json({
        message: "OTP sent successfully",
        otpId: otpVerification.otpId,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const { otpId, otp } = req.body;

    const verificationResult = await authService.verifyOtp(otpId, otp);
    res
      .status(verificationResult.status)
      .json({
        message: verificationResult.message,
        token: verificationResult.token,
      });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
}

export default { loginUser, verifyOtp };
