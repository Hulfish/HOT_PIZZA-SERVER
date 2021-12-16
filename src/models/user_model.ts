import { IUser_model } from './../interfaces/models';
import { Schema, model } from "mongoose";

const userSchema = new Schema<IUser_model>({
    nickname: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    isAdmin: {type: Boolean, default: false}
})

export const UserModel = model<IUser_model>("User", userSchema)