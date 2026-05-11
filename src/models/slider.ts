import mongoose, { Schema } from "mongoose";

export type SliderType = "directImage" | "withImage" | "withoutImage";

const sliderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },

    buttonName: {
      type: String,
      default: "Shop Now",
    },

    sliderType: {
      type: String,
      enum: ["directImage", "withImage", "withoutImage"],
      default: "withoutImage",
      required: true,
    },

    image: {
      type: String, // required only when sliderType != "withoutImage"
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 100,
    },
     isDelete: {
      type: Boolean,
      default : false,
    }
  },
  { timestamps: true }
);

  const Slider =
    mongoose.models.Slider || mongoose.model("Slider", sliderSchema);
  
  export default Slider;