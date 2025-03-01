import AppError from "../../utils/app_error.js"
import { STATUS_CODES } from "../../utils/enums.js"

async function createInspector(email, password) {
    try {
        return { email, password }
    } catch (error) {
        return new AppError("Error creating user", STATUS_CODES.INTERNAL_SERVER_ERROR)
    }


}


export default { createInspector }