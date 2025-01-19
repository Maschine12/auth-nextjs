import mongoose, { Schema, ObjectId } from "mongoose";

export interface IUser {
    _id?: ObjectId | string;
    password: string;
    username: string;
    createdAt?: string;
    updatedAt?: string;
}

const UserSchema: Schema = new Schema(
    {
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
