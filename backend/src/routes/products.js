const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// CREATE (for seeding/admin use)
router.post('/', async (req, res) => {
  const { name, description, category, price, stock, imageUrl } = req.body;
  if (!name || !category || price == null || stock == null) {
    return res.status(400).json({ error: 'name, category, price, and stock are required' });
  }
  const product = await prisma.product.create({
    data: { name, description, category, price, stock: Number(stock), imageUrl },
  });
  res.status(201).json(product);
});

// LISTING — supports search + filtering, per the brief:
//   /products?search=shirt&category=Apparel&minPrice=10&maxPrice=50&inStock=true
router.get('/', async (req, res) => {
  const { search, category, minPrice, maxPrice, inStock } = req.query;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
      ],
    }),
    ...(category && { category }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
    ...(inStock === 'true' && { stock: { gt: 0 } }),
  };

  const products = await prisma.product.findMany({ where, orderBy: { id: 'asc' } });
  res.json(products);
});

// PRODUCT DETAILS
router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { name, description, category, price, stock, imageUrl } = req.body;
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(name != null && { name }),
        ...(description != null && { description }),
        ...(category != null && { category }),
        ...(price != null && { price }),
        ...(stock != null && { stock: Number(stock) }),
        ...(imageUrl != null && { imageUrl }),
      },
    });
    res.json(product);
  } catch {
    res.status(404).json({ error: 'Product not found' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
