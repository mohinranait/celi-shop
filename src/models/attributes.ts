import { IAttributeBase } from '@/redux/service/attributes/type';
import mongoose, { Schema, Document, Model } from 'mongoose';

// টাইপ ডেফিনিশন
export interface IAttribute extends IAttributeBase, Document {
 
}

const AttributeSchema: Schema<IAttribute> = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    displayName: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },

    status: {
      type: Boolean,
      default: true
    },
    priority: Number,
    isDelete: {
      type: Boolean,
      default : false,
    },
  
    values: [
      { 
        type: String, 
        trim: true 
      }
    ],
    
  },
  { timestamps: true }
);

// ডুপ্লিকেট এড়াতে ইনডেক্স
AttributeSchema.index({ name: 1 });

const Attribute: Model<IAttribute> = 
  mongoose.models.Attribute || mongoose.model<IAttribute>('Attribute', AttributeSchema);

export default Attribute;
