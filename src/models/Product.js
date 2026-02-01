import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: String,
  category: String,
  price: Number,
  imgURL: String,
  description: String,
  stock: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true,
  versionKey: false
});

export default model('Product', productSchema);
