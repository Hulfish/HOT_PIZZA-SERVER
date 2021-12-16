import { Request, Response } from 'express';
import { NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import path from "path"


interface IUploadImage_request extends Request {
    body: {
        name: string | undefined
    }
}

interface IRequestFiles {
    image: UploadedFile
}


export class UploadController {
    static async uploadImage (req: IUploadImage_request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.files) {
                return
            }
            const reqFiles = req.files as unknown
            const files = reqFiles as IRequestFiles
            console.log("image: ", files.image)
            console.log("dir: ", __dirname)
            const fileName = files.image.name
            const uploadPath = path.resolve(__dirname, "..", "static", "images", fileName)
            files.image.mv(uploadPath)
            res.status(201).json({message: "success", image: files.image.data})
            return
        } catch (e) {
            next(e)
        }
    }
}