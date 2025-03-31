import mongoose, { Mongoose } from "mongoose";
import { USER_ROLE } from "../utils/enums.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.INSPECTOR,
    },
    department: {
      type: String,
      ref: "Department",
    },
    state: {
      type: String,
      ref: "Department",
    },
    district: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },

    formattedAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema) || mongoose.models.User;
export default User;
