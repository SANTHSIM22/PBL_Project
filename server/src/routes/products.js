import express from 'express';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Create product (artisan only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, madeBy, imageUrl, price } = req.body;
    if (!name || !madeBy || !imageUrl || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = new Product({
      name,
      madeBy,
      imageUrl,
      price: parseFloat(price),
      artisanId: req.user.id
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('artisanId', 'username email slug').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artisanId', 'username email slug');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (artisan owner or admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if user is the artisan who created it or is superadmin
    if (product.artisanId.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, madeBy, imageUrl, price } = req.body;
    if (name) product.name = name;
    if (madeBy) product.madeBy = madeBy;
    if (imageUrl) product.imageUrl = imageUrl;
    if (price) product.price = parseFloat(price);
    product.updatedAt = Date.now();

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (artisan owner or admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if user is the artisan who created it or is superadmin
    if (product.artisanId.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export { authMiddleware };
export default router;
