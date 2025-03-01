import inspectorServices from "../../services/inspector/inspector.services.js";
import AppError from "../../utils/app_error.js";
import { STATUS_CODES } from "../../utils/enums.js";

async function registerInspector(req, res) {

    const { email, password } = req.body;
    if (!email || !password) {
        return new AppError("Email and Password are required", STATUS_CODES.BAD_REQUEST)
    }

    try {
        const response = await inspectorServices.createInspector(email, password)
        return res.json({
            result: response

        })

    } catch (error) {
        return new AppError('Something went wrong', STATUS_CODES.INTERNAL_SERVER_ERROR)

    }
}

export default { registerInspector }