
import mongoose, { Model } from "mongoose";


export interface IContact extends  Document {
  fullName: string,
  email: string,
  phone: string,
  orderNumber: string,
  subject: string,
  message: string,
}


const contactSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type : String,
    },
    phone: {
        type : String,
    },
    orderNumber: {
        type : String,
    },
    subject: {
        type : String,
    },
    message: {
        type : String,
    },
}, {timestamps:true});



const Contact: Model<IContact> = (mongoose.models && mongoose.models.Contact)
  ? mongoose.models.Contact
  : mongoose.model<IContact>("Contact", contactSchema);

export default Contact;