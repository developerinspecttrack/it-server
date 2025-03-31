import { response } from "express";
import authService from "../../services/auth/auth.service.js";
import { STATUS_CODES } from "../../utils/enums.js";

async function getProfile(req, res) {
  const userResponse = await authService.getUserProfile(req.user.id);
  console.log("User profile returned");
  return res.status(userResponse.status).json({
    userEmail: userResponse.userEmail,
    address: userResponse.address,
  });
}

async function setUserRole(req, res) {
  let { userType } = req.body;
  console.log("user type: ", userType);

  if (!userType) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: "User type is required",
    });
  }

  const userResponse = await authService.setUserRole({
    userId: req.user.id,
    userType: userType,
  });

  return res
    .status(userResponse.status ? userResponse.status : STATUS_CODES.OK)
    .json({
      message: userResponse.message,
      userType: userResponse.userType,
    });
}

async function setUserProfile(req, res) {
  const { name, contactNumber, department, state } = req.body;
  if (!name || !contactNumber || !department || !state) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: "Name, contact number, department, and state are required",
    });
  }

  const userProfile = await authService.setUserProfile({
    name: name,
    contactNumber: contactNumber,
    department: department,
    state: state,
    userId: req.user.id,
  });

  return res.status(userProfile.status).json({
    message: userProfile.message,
    userProfile: userProfile.userProfile,
  });
}
export default { getProfile, setUserRole, setUserProfile };
