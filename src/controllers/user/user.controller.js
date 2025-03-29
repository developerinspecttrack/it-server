import authService from "../../services/auth/auth.service.js";

async function getProfile(req, res) {
  const userResponse = await authService.getUserProfile(req.user.id);
  console.log("User profile returned");
  return res.status(userResponse.status).json({
    userEmail: userResponse.userEmail,
    address: userResponse.address,
  });
}

export default { getProfile };
