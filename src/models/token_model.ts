import { IToken_model } from './../interfaces/models';
import { model, Schema } from "mongoose";


const TokenSchema = new Schema<IToken_model>({
    token: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true, unique: true}
})

export const TokenModel = model<IToken_model>("Token", TokenSchema)