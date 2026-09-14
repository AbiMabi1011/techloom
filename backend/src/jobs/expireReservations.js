const prisma = require('../lib/prisma');

async function expireStaleReservations() {
  const staleOrders = await prisma.order.findMany({
    where: { status: 'RESERVED', reservationExpiresAt: { lt: new Date() } },
    include: { items: true },
  });

  for (const order of staleOrders) {
    try {
      await prisma.$transaction(async (tx) => {
        const fresh = await tx.order.findUnique({ where: { id: order.id } });
        if (!fresh || fresh.status !== 'RESERVED') return;

        for (const item of order.items) {
          await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
        }
        await tx.order.update({ where: { id: order.id }, data: { status: 'EXPIRED', reservationExpiresAt: null } });
      });
      console.log(`Order ${order.id} expired; stock released.`);
    } catch (err) {
      console.error(`Failed to expire order ${order.id}:`, err);
    }
  }
}

function startExpirySweeper(intervalMs = 30_000) {
  setInterval(expireStaleReservations, intervalMs);
  console.log(`Reservation expiry sweeper started (every ${intervalMs / 1000}s).`);
}

module.exports = { startExpirySweeper, expireStaleReservations };
