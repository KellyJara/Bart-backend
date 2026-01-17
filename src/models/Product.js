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
  inCart: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  versionKey: false
});

export default model('Product', productSchema);
