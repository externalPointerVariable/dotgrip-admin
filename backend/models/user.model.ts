import {Document, Schema, model} from "mongoose";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
  EDITOR = "editor"
}

interface IUser extends Document {
  username: string;
  profile: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const UserModel = model<IUser>("User", UserSchema);
