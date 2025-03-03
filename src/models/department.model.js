

import mongoose from "mongoose";


const departmentSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,

    }
}, {
    timestamps: true
})

const Department = mongoose.model("Department", departmentSchema) || mongoose.models.Department
export default Department;