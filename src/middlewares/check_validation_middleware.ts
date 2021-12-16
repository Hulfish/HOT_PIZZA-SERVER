import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function checkValidationMiddleware (req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array({onlyFirstError: false})})
        }
        next()
    } catch (e) {
        next(e)
    }
}