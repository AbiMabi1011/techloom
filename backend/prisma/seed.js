const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const techProducts = [
  {
    name: 'Cyberpunk Custom Mechanical Keyboard',
    description: 'CNC-milled aluminum chassis with pre-lubed hot-swappable switches, PBT keycaps, and customizable per-key RGB backlighting.',
    category: 'Peripherals',
    price: 169.99,
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Precision Wireless Gaming & Workstation Mouse',
    description: 'Ultra-lightweight 26,000 DPI optical sensor with sub-1ms wireless latency, PTFE skates, and 90-hour continuous battery life.',
    category: 'Peripherals',
    price: 89.00,
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Active Noise-Cancelling Studio Headphones',
    description: 'Audiophile planar magnetic drivers with dual-mic ANC, memory foam protein cushions, and lossless low-latency Bluetooth 5.4 codec.',
    category: 'Audio',
    price: 279.00,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Spatial Audio True-Wireless Earbuds',
    description: 'Hybrid active noise cancellation, transparency mode, wireless charging case, and IPX7 sweat/water resistance.',
    category: 'Audio',
    price: 149.50,
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Titanium Ultra Smartwatch Pro',
    description: 'Aerospace-grade titanium casing, sapphire crystal OLED display, continuous ECG/SpO2 tracking, and dual-frequency GPS.',
    category: 'Wearables',
    price: 349.00,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fast Wireless Magnetic Charging Pad 3-in-1',
    description: '15W high-speed magnetic charging station capable of simultaneously powering phone, smartwatch, and earbuds with overheat protection.',
    category: 'Accessories',
    price: 69.99,
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Thunderbolt 4 Ultra-Dock 12-Port Station',
    description: '40Gbps transfer speeds supporting dual 4K 144Hz displays, 100W Power Delivery charging, Gigabit Ethernet, and UHS-II SD card readers.',
    category: 'Accessories',
    price: 199.00,
    stock: 22,
    imageUrl: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Smart Lightbar Monitor Light with Wireless Dial',
    description: 'Asymmetric optical design prevents screen glare, auto-dimming ambient light sensor, and stepless color temperature dial control.',
    category: 'Workspace',
    price: 89.99,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
  },
];

async function seed() {
  console.log('Clearing old non-tech cart items, order items, and products...');
  // Clean cart items & order items to prevent foreign key errors
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('Seeding pure tech products...');
  for (const item of techProducts) {
    await prisma.product.create({
      data: item,
    });
  }
  console.log(`Seeded ${techProducts.length} 100% tech products successfully.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
