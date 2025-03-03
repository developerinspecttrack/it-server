import mongoose, { Mongoose } from 'mongoose';
import { USER_ROLE } from '../utils/enums.js';


const userSchema = mongoose.Schema({
    name: {
        type: String,

    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(USER_ROLE),
        default: USER_ROLE.FIELD_OFFICERS
    },
    department: {
        type: mongoose.Schema.Types.ObjectId, ref: "Department"
    },
    district: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})


const User = mongoose.model("User", userSchema) || mongoose.models.User;
export default User