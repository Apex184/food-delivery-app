import { Request, Response, NextFunction } from "express"
import { AuthPayload } from "../DTO/Auth.dto";
import { validateSignature } from "../utility";



declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}

export const Authentication = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await validateSignature(req);

    if (validate) {

        next();

    } else {
        return res.status(403).json({
            success: false, message: 'User is not authorized'
        });
    }
}