import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import errorHandler from "./src/middlewares/error.middleware.js";
import AppError from "./src/utils/app_error.js";
import { STATUS_CODES } from "./src/utils/enums.js";

dotenv.config()
const app = express();
app.use(express.json())
app.use(cors())



app.get("/protected", (req, res, next) => {
    next(new AppError("Unauthorized Access", STATUS_CODES.UNAUTHORIZED));
});


app.use(errorHandler)



app.listen(process.env.PORT, () => {
    console.log(`Server started on the  port ${process.env.PORT}`)
})