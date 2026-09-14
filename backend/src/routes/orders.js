const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

const RESERVATION_MINUTES = 5;

// POST /orders/checkout — body: { customerId, idempotencyKey }
// Converts the customer's current cart into a reserved order, atomically
// decrementing stock per item (same conditional-update pattern as Task 01).
router.post('/checkout', async (req, res) => {
  const { customerId, idempotencyKey } = req.body;

  if (!customerId || !idempotencyKey) {
    return res.status(400).json({ error: 'customerId and idempotencyKey are required' });
  }

  const existingOrder = await prisma.order.findUnique({ where: { idempotencyKey } });
  if (existingOrder) {
    return res.status(200).json(existingOrder);
  }

  const cart = await prisma.cart.findUnique({
    where: { customerId },
    include: { items: true },
  });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      for (const { productId, quantity } of cart.items) {
        const result = await tx.product.updateMany({
          where: { id: productId, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (result.count === 0) {
          throw new Error(`INSUFFICIENT_STOCK:${productId}`);
        }
        const product = await tx.product.findUnique({ where: { id: productId } });
        total += Number(product.price) * quantity;
        orderItemsData.push({ productId, quantity, priceAtOrder: product.price });
      }

      const newOrder = await tx.order.create({
        data: {
          customerId,
          status: 'RESERVED',
          totalAmount: total,
          reservationExpiresAt: new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000),
          idempotencyKey,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });

      // Clear the cart now that its contents have become an order.
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    res.status(201).json(order);
  } catch (err) {
    if (err.message?.startsWith('INSUFFICIENT_STOCK')) {
      const productId = err.message.split(':')[1];
      return res.status(409).json({ error: `Insufficient stock for product ${productId}` });
    }
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// GET /orders — all orders for Admin Panel overview
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, paymentAttempts: true },
      orderBy: { id: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch all orders' });
  }
});

// GET /orders/customer/:customerId — order history
router.get('/customer/:customerId', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { customerId: req.params.customerId },
    include: { items: { include: { product: true } } },
    orderBy: { id: 'desc' },
  });
  res.json(orders);
});

// GET /orders/:id
router.get('/:id', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: Number(req.params.id) },
    include: { items: { include: { product: true } }, paymentAttempts: true },
  });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// POST /orders/:id/cancel
router.post('/:id/cancel', async (req, res) => {
  const orderId = Number(req.params.id);
  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!existing) throw new Error('NOT_FOUND');
      if (!['PENDING', 'RESERVED'].includes(existing.status)) {
        throw new Error(`INVALID_TRANSITION:${existing.status}`);
      }
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      return tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED', reservationExpiresAt: null },
      });
    });
    res.json(order);
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Order not found' });
    if (err.message?.startsWith('INVALID_TRANSITION')) {
      return res.status(409).json({ error: `Cannot cancel an order in status ${err.message.split(':')[1]}` });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// POST /orders/:id/refund — simulate a refund for a cancelled or failed *paid* order.
// Per the brief: refunds apply to "cancelled or failed paid orders" — i.e. an
// order that was PAID and is now being reversed (post-purchase cancellation).
router.post('/:id/refund', async (req, res) => {
  const orderId = Number(req.params.id);
  try {
    const order = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!existing) throw new Error('NOT_FOUND');

      // Only a PAID order can be refunded. Cancelling a paid order first
      // transitions it here rather than through the plain /cancel route,
      // since a paid order has already consumed stock permanently until refunded.
      if (existing.status !== 'PAID') {
        throw new Error(`INVALID_TRANSITION:${existing.status}`);
      }

      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: orderId },
        data: { status: 'REFUNDED', refundedAt: new Date() },
      });
    });
    res.json(order);
  } catch (err) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Order not found' });
    if (err.message?.startsWith('INVALID_TRANSITION')) {
      return res.status(409).json({ error: `Only a PAID order can be refunded (current status: ${err.message.split(':')[1]})` });
    }
    console.error(err);
    res.status(500).json({ error: 'Refund failed' });
  }
});

module.exports = router;
