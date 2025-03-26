import authService from "../../services/auth/auth.service.js";
import { STATUS_CODES } from "../../utils/enums.js";

async function loginUser(req, res) {
  const { email } = req.body;

  const sendOtpResponse = await authService.sendOtp(email);
  if (sendOtpResponse) {
    res.status(sendOtpResponse.status).json({
      message: sendOtpResponse.message,
      otpId: sendOtpResponse.otpId,
    });
  }
}

async function resendOtp(req, res) {
  const { email } = req.body;

  const resendOtpResponse = await authService.resendOtp(email);
  if (resendOtpResponse) {
    res.status(resendOtpResponse.status).json({
      message: resendOtpResponse.message,
      otpId: resendOtpResponse.otpId,
    });
  }
}

async function verifyOtp(req, res) {
  const { otpId, otp } = req.body;

  const verificationResult = await authService.verifyOtp(otpId, otp);
  res.status(verificationResult.status).json({
    message: verificationResult.message,
    accessToken: verificationResult.accessToken,
    refreshToken: verificationResult.refreshToken,
  });
}

export default { loginUser, verifyOtp, resendOtp };
