import mongoose, { Schema, Model, Document } from "mongoose";

// =======================
// TypeScript interface
// =======================
export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  // profile?: mongoose.Types.ObjectId;
  role?: "Admin" | "User";
  status?: "Active" | "Pending" | "Banned";
}

// =======================
// Schema
// =======================
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    // profile: { type: Schema.Types.ObjectId, ref: "Media" }, // reference
    role: { type: String, default: "User", enum: ["Admin", "User"] },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Pending", "Banned"],
    },
  },
  { timestamps: true },
);

// =======================
// Hot reload safe for Next.js
// =======================
const User: Model<IUser> =
  mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : mongoose.model<IUser>("User", userSchema);

export default User;
