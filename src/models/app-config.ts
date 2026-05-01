import mongoose, { Schema, Document, Model } from "mongoose";

interface IApp extends Document {
  email: {
    user: string;
    password: string;
    status: boolean;
  };
  cloudinary: {
    name: string;
    key: string;
    secret: string;
    status: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const appSchema: Schema<IApp> = new mongoose.Schema(
  {
    email: {
      user: { type: String },
      password: { type: String },
      status: { type: Boolean },
    },
    cloudinary: {
      name: { type: String },
      key: { type: String },
      secret: { type: String },
      status: { type: Boolean },
    },
  },
  { timestamps: true },
);

// Check if model exists, otherwise create
const AppModel: Model<IApp> =
  mongoose.models.AppModel || mongoose.model<IApp>("AppModel", appSchema);

export default AppModel;