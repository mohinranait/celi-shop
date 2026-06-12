import mongoose, {  Schema } from "mongoose";

const SiteContentSchema = new Schema(
  {
    companyIntroduction: {
      title: String,
      heading: String,
      description1: String,
      description2: String,

      image: {
        url: String,
        alt: String,
      },

      buttonText: String,
      buttonLink: String,
    },


    whyChooseUs: {
      title: String,
      heading: String,

      items: [
        {
          icon: String,
          title: String,
          description: String,
        },
      ],
    },
  },

  {
    timestamps: true,
  }
);




const SiteContent =
  mongoose.models.SiteContent || mongoose.model("SiteContent", SiteContentSchema);

export default SiteContent;