import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()


async function connectDB() {
    try {

        const connection = await mongoose.connect(process.env.DB_URL);
        console.log(`Connected to db`)

    } catch (error) {
        console.log("[ERROR_CONNECTING_DB] :", error);

    }
}

export default connectDB;