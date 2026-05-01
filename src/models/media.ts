import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    extension: {
        type: String,
    },
    public_id: {
        type: String,
    },
    secure_url: {
        type: String,
    },
    size: {
        type: Number,
    }
}, { timestamps: true });

const Media =  mongoose.models.Media || mongoose.model("Media", fileSchema)
export default Media;