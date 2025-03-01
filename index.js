import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import errorHandler from "./src/middlewares/error.middleware.js";
import AppError from "./src/utils/app_error.js";
import { STATUS_CODES } from "./src/utils/enums.js";
import inspectorRoutes from "./src/routes/inspector.routes.js";
import swaggerDocs from "./src/config/swagger.js";

dotenv.config()
const app = express();
app.use(express.json())
app.use(cors())



app.use("/api/inspector",inspectorRoutes);
swaggerDocs(app);

app.use(errorHandler)



app.listen(process.env.PORT, () => {
    console.log(`Server started on the  port ${process.env.PORT}`)
})