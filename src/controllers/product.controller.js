import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
    const products = await Product.find()
    .populate('owner', 'username email profileImg');
    res.json(products);
}

export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.productId)
    .populate('owner','username email profileImg');
    res.status(200).json(product);
}

export const createProduct = async (req, res) => {
  const { name, category, price, imgURL, description, stock, isActive, inCart } = req.body;

  const newProduct = new Product({
    name,
    category,
    price,
    imgURL,
    description,
    stock,
    isActive,
    owner: req.userId, // sellerId
  });

  const savedProduct = await newProduct.save();

  const populatedProduct = await savedProduct.populate('owner', 'username email profilImg');

  res.status(201).json(populatedProduct);
};

export const updateProduct = async (req, res) => {
  const { name, category, price, imgURL, description, stock, isActive, inCart } = req.body;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    { name, category, price, imgURL, description, stock, isActive, inCart },
    { new: true }
  ).populate('owner', 'username email'); // ✅ poblar aquí

  res.status(200).json(updatedProduct);
};

export const deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.productId);
    res.status(204).json({message: "Product deleted"});
}
