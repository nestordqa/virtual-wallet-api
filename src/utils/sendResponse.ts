import { Response } from "express";

/**
 * **Error Responses Mapping**
 * A mapping of error codes to their corresponding messages and HTTP status codes.
 */
const errorResponses: { [key: string]: { message: string; status: number } } = {
    '00': { message: 'Success', status: 200 }, // Indicates a successful operation
    '01': { message: 'Internal Server Error', status: 500 }, // Generic error for server issues
    '02': { message: 'User not found', status: 404 }, // Error when a user is not found
    '03': { message: 'Insufficient balance', status: 400 }, // Error for insufficient funds
};

/**
 * **sendResponse**
 * A utility function to send standardized responses in the app.
 * 
 * @param res - The Express `Response` object used to send the HTTP response.
 * @param success - A boolean indicating whether the operation was successful.
 * @param cod_error - A string representing the error code (e.g., '00', '01', etc.).
 * @param message_error - (Optional) A custom error message to override the default message.
 * @param data - (Optional) Any additional data to include in the response payload.
 */
export function sendResponse(
    res: Response,
    success: boolean,
    cod_error: string,
    message_error?: string,
    data: any = null
) {
    const response = errorResponses[cod_error] || { message: 'Unknown error', status: 400 };
    
    return res.status(success ? response.status : response.status).json({
        success,
        cod_error,
        message_error: message_error || response.message,
        data
    });
}
