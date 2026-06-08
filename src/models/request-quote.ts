
import { IBaseRequestQuote } from '@/redux/service/request-quote/type';
import mongoose, { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IDRequestQuote extends IBaseRequestQuote , Document {
   productId: Types.ObjectId | null;
}

const requestQuoteSchema = new Schema<IDRequestQuote>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', default: null },

  location : {
    address: String,
    zipCode: String,
    district: String,
  },
  request: {
    name: String,
    whatsappNumber: String,
    phone: String,
  },
  quantity: Number,
  notes: { type: String },
 

}, { timestamps: true });

export const RequestQuote = mongoose.models.RequestQuote || mongoose.model<IDRequestQuote>('RequestQuote', requestQuoteSchema);
