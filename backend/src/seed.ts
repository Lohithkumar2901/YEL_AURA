import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function makeSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Unsplash — curated fashion photos matched to each product/category
const img = (id: string, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

async function main() {
  console.log('🌱 Seeding Yel Aura...');

  // ─── Users ────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const customerPassword = await bcrypt.hash('Customer@123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@yelaura.com' },
    update: {},
    create: { name: 'Yel Aura Admin', email: 'admin@yelaura.com', password: adminPassword, role: 'admin', phone: '9999999999' },
  });

  await prisma.user.upsert({
    where: { email: 'customer@yelaura.com' },
    update: {},
    create: { name: 'Test Customer', email: 'customer@yelaura.com', password: customerPassword, role: 'customer', phone: '8888888888' },
  });

  console.log('✅ Users seeded');

  // ─── Categories ───────────────────────────────────────────────────────────
  const categoryData = [
    { name: "Women's Wear",  slug: 'womens-wear',  image: img('1490481651871-ab68de25d43d', 600, 600) },
    { name: "Men's Wear",    slug: 'mens-wear',    image: img('1489987707849-dc0cf24a4a5a', 600, 600) },
    { name: 'Dresses',       slug: 'dresses',      image: img('1572804013309-59a88b7e92f1', 600, 600) },
    { name: 'Accessories',   slug: 'accessories',  image: img('1584917865442-2604a8ff1295', 600, 600) },
    { name: 'Footwear',      slug: 'footwear',     image: img('1543163521-1bf539c55dd2', 600, 600) },
    { name: 'Sale',          slug: 'sale',         image: img('1594938298603-e8548ee2fc4c', 600, 600) },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { image: cat.image },
      create: { name: cat.name, slug: cat.slug, image: cat.image },
    });
    categories[cat.name] = created.id;
  }
  console.log('✅ Categories seeded');

  // ─── Products ─────────────────────────────────────────────────────────────
  const productsData = [
    {
      name: 'Floral Anarkali Kurti',
      description: 'Beautiful floral print Anarkali kurti perfect for festive occasions. Made from soft rayon fabric with intricate embroidery at the neckline.',
      price: 1299, discountPrice: 999, stock: 50, category: "Women's Wear", featured: true,
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Red','Blue','Green'],
      images: [img('1483985988355-763728e1b197'), img('1558618666-fcd25c85cd64')],
    },
    {
      name: 'Straight Cotton Kurti',
      description: 'Classic straight cut kurti in premium cotton. Ideal for daily wear with a comfortable fit and breathable fabric.',
      price: 799, discountPrice: 649, stock: 80, category: "Women's Wear", featured: false,
      sizes: ['S','M','L','XL'], colors: ['White','Yellow','Pink'],
      images: [img('1490481651871-ab68de25d43d'), img('1469334031218-e382a71b716b')],
    },
    {
      name: 'Kanjivaram Silk Saree',
      description: 'Authentic Kanjivaram silk saree with traditional zari border and pallu. Perfect for weddings and special occasions.',
      price: 8999, discountPrice: 7499, stock: 20, category: "Women's Wear", featured: true,
      sizes: ['Free Size'], colors: ['Maroon','Navy Blue','Green'],
      images: [img('1515886657613-9f3515b0c78f'), img('1534528741775-53994a69daeb')],
    },
    {
      name: 'Sharara Set with Dupatta',
      description: 'Festive sharara set with intricate threadwork. Complete with matching dupatta for a traditional look.',
      price: 3999, discountPrice: 3199, stock: 35, category: "Women's Wear", featured: true,
      sizes: ['XS','S','M','L','XL'], colors: ['Orange','Turquoise','Royal Blue'],
      images: [img('1558618666-fcd25c85cd64'), img('1517841905240-472988babdf9')],
    },
    {
      name: 'Wide Leg Palazzo Pants',
      description: 'Comfortable wide-leg palazzo pants in flowy fabric. Perfect for a relaxed yet chic look.',
      price: 1099, discountPrice: 849, stock: 55, category: "Women's Wear", featured: false,
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','Olive','Mustard'],
      images: [img('1515886657613-9f3515b0c78f'), img('1534528741775-53994a69daeb')],
    },
    {
      name: 'Classic Polo T-Shirt',
      description: 'Premium pique cotton polo shirt with a refined look. Suitable for casual and smart casual outings.',
      price: 999, discountPrice: 799, stock: 120, category: "Men's Wear", featured: false,
      sizes: ['S','M','L','XL','XXL'], colors: ['White','Navy','Black','Olive'],
      images: [img('1507003211169-0a1dd7228f2d'), img('1489987707849-dc0cf24a4a5a')],
    },
    {
      name: 'Slim Fit Chinos',
      description: 'Versatile slim-fit chinos in stretch cotton blend. Perfect for both office and weekend wear.',
      price: 1899, discountPrice: 1499, stock: 90, category: "Men's Wear", featured: true,
      sizes: ['28','30','32','34','36','38'], colors: ['Khaki','Charcoal','Navy','Beige'],
      images: [img('1519085360753-af0119f7cbe7'), img('1552374196-1ab2a1c593e8')],
    },
    {
      name: 'Linen Casual Shirt',
      description: 'Breathable linen shirt ideal for warm weather. Features a relaxed fit and subtle texture.',
      price: 1499, discountPrice: 1199, stock: 70, category: "Men's Wear", featured: false,
      sizes: ['S','M','L','XL','XXL'], colors: ['Sky Blue','White','Mint','Sand'],
      images: [img('1587560699334-cc4ff634909a'), img('1617952385804-eab18959c6b2')],
    },
    {
      name: 'Denim Jacket',
      description: 'Classic denim jacket with distressed details. A wardrobe essential that pairs with everything.',
      price: 2199, discountPrice: 1799, stock: 65, category: "Men's Wear", featured: false,
      sizes: ['XS','S','M','L','XL','XXL'], colors: ['Light Blue','Dark Blue','Black'],
      images: [img('1576566588028-4147f3842f27'), img('1556821840-3a63f10be5b8')],
    },
    {
      name: 'Floral Midi Dress',
      description: 'Charming floral midi dress with puff sleeves. Perfect for brunches, casual outings, and summer events.',
      price: 1899, discountPrice: 1499, stock: 60, category: 'Dresses', featured: true,
      sizes: ['XS','S','M','L','XL'], colors: ['Floral Pink','Floral Blue','Floral Yellow'],
      images: [img('1572804013309-59a88b7e92f1'), img('1470116945706-e6bf5d5a53ca')],
    },
    {
      name: 'Bodycon Evening Dress',
      description: 'Sophisticated bodycon dress for evening events. Features ruched detailing and a flattering silhouette.',
      price: 2499, discountPrice: 1999, stock: 40, category: 'Dresses', featured: false,
      sizes: ['XS','S','M','L'], colors: ['Black','Red','Emerald'],
      images: [img('1596755389378-c31d21fd1273'), img('1470116945706-e6bf5d5a53ca')],
    },
    {
      name: 'Wrap Midi Dress',
      description: 'Elegant wrap-style midi dress with adjustable tie waist. Flatters all body types for any occasion.',
      price: 2199, discountPrice: 1749, stock: 55, category: 'Dresses', featured: true,
      sizes: ['XS','S','M','L','XL'], colors: ['Rust','Teal','Blush'],
      images: [img('1571513722275-4b41940f54b8'), img('1558769132-cb1aea458c5e')],
    },
    {
      name: 'Gold Chain Necklace',
      description: 'Delicate 18K gold-plated chain necklace with pendant. A timeless piece for everyday or special wear.',
      price: 1499, discountPrice: 1199, stock: 150, category: 'Accessories', featured: false,
      sizes: ['One Size'], colors: ['Gold','Rose Gold','Silver'],
      images: [img('1584917865442-2604a8ff1295'), img('1599643478702-b4db3de18c97')],
    },
    {
      name: 'Leather Tote Bag',
      description: 'Spacious leather tote bag with magnetic closure and inner pockets. Perfect for work and everyday use.',
      price: 3499, discountPrice: 2799, stock: 45, category: 'Accessories', featured: true,
      sizes: ['One Size'], colors: ['Black','Brown','Tan'],
      images: [img('1548036161-bcb2e87a85b7'), img('1553062407-98eeb64c6a62')],
    },
    {
      name: 'Classic Silk Scarf',
      description: 'Luxurious silk scarf with vibrant print. Versatile accessory that can be worn multiple ways.',
      price: 999, discountPrice: 799, stock: 80, category: 'Accessories', featured: false,
      sizes: ['One Size'], colors: ['Multicolor','Blue Print','Red Print'],
      images: [img('1601924994987-f02073dcf3e1'), img('1609505580220-a41e2e5d14f7')],
    },
    {
      name: 'Block Heel Sandals',
      description: 'Comfortable block heel sandals with ankle strap. Combines style and comfort for all-day wear.',
      price: 2499, discountPrice: 1999, stock: 65, category: 'Footwear', featured: true,
      sizes: ['36','37','38','39','40','41'], colors: ['Nude','Black','White'],
      images: [img('1543163521-1bf539c55dd2'), img('1572635196237-14b3f281503f')],
    },
    {
      name: 'White Sneakers',
      description: 'Classic white leather sneakers with cushioned sole. A must-have wardrobe staple for casual looks.',
      price: 3299, discountPrice: 2799, stock: 75, category: 'Footwear', featured: false,
      sizes: ['36','37','38','39','40','41','42'], colors: ['White','White/Gold','White/Pink'],
      images: [img('1542291026-7eec264c27ff'), img('1600269452121-4f2416e55c28')],
    },
    {
      name: 'Embroidered Crop Top',
      description: 'Trendy embroidered crop top in cotton blend. Pairs well with high-waist jeans or skirts.',
      price: 699, discountPrice: 549, stock: 100, category: 'Sale', featured: false,
      sizes: ['XS','S','M','L','XL'], colors: ['White','Cream','Lilac'],
      images: [img('1594938298603-e8548ee2fc4c'), img('1571513800374-a47f4ed71b39')],
    },
    {
      name: 'Blazer Coord Set',
      description: 'Power-dressing blazer coord set in premium crepe fabric. Perfect for meetings, events, and evenings out.',
      price: 4499, discountPrice: 2699, stock: 25, category: 'Sale', featured: true,
      sizes: ['XS','S','M','L','XL'], colors: ['Camel','Charcoal','Blush'],
      images: [img('1536031009-e13dc3dae12e'), img('1509631179647-0177331693ae')],
    },
    {
      name: 'High-Waist Pleated Skirt',
      description: 'Classic high-waist pleated midi skirt. Timeless style that works for both office and casual settings.',
      price: 1299, discountPrice: 1049, stock: 45, category: 'Sale', featured: false,
      sizes: ['XS','S','M','L','XL'], colors: ['Navy','Burgundy','Khaki'],
      images: [img('1617922638236-91ef3e3e2abb'), img('1638787377435-15e2f8847d38')],
    },
  ];

  for (const product of productsData) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (existing) {
      // Update images to use Picsum
      await prisma.product.update({
        where: { id: existing.id },
        data: { images: JSON.stringify(product.images) },
      });
    } else {
      const slug = makeSlug(product.name) + '-' + Date.now();
      await prisma.product.create({
        data: {
          name: product.name, slug,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
          stock: product.stock,
          categoryId: categories[product.category],
          featured: product.featured,
          sizes: JSON.stringify(product.sizes),
          colors: JSON.stringify(product.colors),
          images: JSON.stringify(product.images),
        },
      });
    }
    process.stdout.write('.');
  }
  console.log('\n✅ Products seeded');

  // ─── Banners ──────────────────────────────────────────────────────────────
  await prisma.banner.deleteMany({});
  const bannersData = [
    { title: 'New Arrivals — Festive Collection', subtitle: 'Shop the latest ethnic wear for every occasion', image: img('1483985988355-763728e1b197', 1400, 600), link: '/shop?category=womens-wear', order: 0, active: true },
    { title: 'Western Wear Sale — Up to 40% Off', subtitle: 'Trendy styles at unbeatable prices', image: img('1558769132-cb1aea458c5e', 1400, 600), link: '/shop?category=sale', order: 1, active: true },
    { title: 'Designer Dresses — Dream Collection', subtitle: 'Make every day unforgettable', image: img('1536031009-e13dc3dae12e', 1400, 600), link: '/shop?category=dresses', order: 2, active: true },
  ];
  for (const banner of bannersData) {
    await prisma.banner.create({ data: banner });
  }
  console.log('✅ Banners seeded');

  // ─── Coupons ─────────────────────────────────────────────────────────────
  const couponsData = [
    { code: 'SAVE10', discountPercentage: 10, expiryDate: new Date('2027-12-31'), active: true },
    { code: 'WELCOME20', discountPercentage: 20, expiryDate: new Date('2027-12-31'), active: true },
    { code: 'FLAT50', discountPercentage: 50, expiryDate: new Date('2027-06-30'), active: true },
  ];
  for (const coupon of couponsData) {
    await prisma.coupon.upsert({ where: { code: coupon.code }, update: {}, create: coupon });
  }
  console.log('✅ Coupons seeded');

  console.log('\n🎉 Seed complete!');
  console.log('   Admin:    admin@yelaura.com / Admin@123');
  console.log('   Customer: customer@yelaura.com / Customer@123');
}

main()
  .catch(err => { console.error('Seed failed:', err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
