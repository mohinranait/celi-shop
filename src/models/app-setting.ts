import { model, models, Schema } from "mongoose";

const appSchema = new Schema({
  appName: {
    type: String,
  },
  logo:{
    lHeader: String,
    lHooter: String,
     dHeader: String,
    dHooter: String,
  },
  meta:{
    title: String,
    tags: [String],
    description: String,
  },
})

const AppSetting = models.AppSetting ? models.AppSetting : model("AppSetting", appSchema)

export default AppSetting;