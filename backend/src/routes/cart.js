const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// Ensures a cart exists for this customer and returns it with items.
async function getOrCreateCart(customerId) {
  let cart = await prisma.cart.findUnique({
    where: { customerId },
    include: { items: { include: { product: true } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId },
      include: { items: { include: { product: true } } },
    });
  }
  return cart;
}

// GET /cart/:customerId
router.get('/:customerId', async (req, res) => {
  const cart = await getOrCreateCart(req.params.customerId);
  res.json(cart);
});

// POST /cart/:customerId/items  — { productId, quantity }
router.post('/:customerId/items', async (req, res) => {
  const { customerId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'productId and a positive quantity are required' });
  }

  const cart = await getOrCreateCart(customerId);

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: Number(productId) } },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + Number(quantity) },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: Number(productId), quantity: Number(quantity) },
    });
  }

  const updated = await getOrCreateCart(customerId);
  res.status(200).json(updated);
});

// PUT /cart/:customerId/items/:productId  — { quantity }
router.put('/:customerId/items/:productId', async (req, res) => {
  const { customerId, productId } = req.params;
  const { quantity } = req.body;

  const cart = await getOrCreateCart(customerId);

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: Number(productId) } });
  } else {
    await prisma.cartItem.updateMany({
      where: { cartId: cart.id, productId: Number(productId) },
      data: { quantity: Number(quantity) },
    });
  }

  const updated = await getOrCreateCart(customerId);
  res.json(updated);
});

// DELETE /cart/:customerId/items/:productId
router.delete('/:customerId/items/:productId', async (req, res) => {
  const { customerId, productId } = req.params;
  const cart = await getOrCreateCart(customerId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: Number(productId) } });
  const updated = await getOrCreateCart(customerId);
  res.json(updated);
});

module.exports = router;
