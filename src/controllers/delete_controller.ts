import { DishModel } from './../models/dish_model';
import { TokenService } from './../services/token_service';
import { UserModel } from './../models/user_model';
import { NextFunction, Response } from 'express';
import { IDelete_user_request } from './../interfaces/requests';
export class DeleteController {
    static async deleteUser (req: IDelete_user_request, res: Response, next: NextFunction) {
        try {
            const email: string = req.body.email
            const candidateToDelete = await UserModel.findOne({email})
            if (!candidateToDelete) {
                return res.send(404)
            }
            await TokenService.deleteTokenByUserId(candidateToDelete.id)
            await UserModel.deleteOne({email})
            
            res.status(200).send()
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
    static async deleteDish (req: IDelete_user_request, res: Response, next: NextFunction) {
        try {
            const product_id = req.params.product_id as string

            await DishModel.findOneAndDelete({product_id: parseInt(product_id)})
            res.json({message: "success"})
        } catch (e) {
            next(e)
        } 
    }
}