const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@qalab.hu' },
    update: {},
    create: {
      email: 'admin@qalab.hu',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@qalab.hu' },
    update: {},
    create: {
      email: 'user@qalab.hu',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('✅ Regular user created:', user.email);

    // Create sample products
  const products = [
    {
      name: 'Bug Hunter Pro 3000',
      description: 'Az ultimate hibavadász eszköztár. Garantáltan megtalálja az összes bugot... vagy legalábbis a legtöbbet.',
      price: 299.99,
      category: 'Software',
      inStock: true,
      rating: 4.8,
      reviewCount: 127,
      image: '/uploads/free_ai_bug_hunter_pro_3000.svg'
    },
    {
      name: 'Coffee-to-Code Converter v2.1',
      description: 'Automatikusan konvertálja a kávét működő kóddá. Inputként fogadja el a latte art-ot is.',
      price: 1299.99,
      category: 'Hardware',
      inStock: true,
      rating: 4.2,
      reviewCount: 89,
      image: '/uploads/free_ai_coffee_to_code_converter_v2_1.svg'
    },
    {
      name: 'Stack Overflow Subscription Premium',
      description: 'Korlátlan hozzáférés a copy-paste funkciókhoz és prémium "works on my machine" válaszokhoz.',
      price: 79.99,
      category: 'Subscription',
      inStock: true,
      rating: 4.9,
      reviewCount: 342,
      image: '/uploads/free_ai_stack_overflow_subscription_premium.svg'
    },
    {
      name: 'Rubber Duck Debugger Enterprise',
      description: 'Professzionális gumikacsa debug partnerséghez. Hallgat, bólint, és sosem ítélkezik.',
      price: 199.99,
      category: 'Hardware',
      inStock: false,
      rating: 4.5,
      reviewCount: 203,
      image: '/uploads/free_ai_rubber_duck_debugger_enterprise.svg'
    },
    {
      name: 'Ctrl+Z Time Machine',
      description: 'Valódi undo funkció az élethez. Működik kód törlésre, email küldésre, és rossz döntésekre.',
      price: 1799.99,
      category: 'Hardware',
      inStock: true,
      rating: 3.7,
      reviewCount: 156,
      image: '/uploads/free_ai_ctrl_z_time_machine.svg'
    },
    {
      name: 'Lorem Ipsum Generator Deluxe',
      description: 'Végtelen placeholder szöveg minden alkalomra. Most már értelmes mondatokkal is!',
      price: 59.99,
      category: 'Software',
      inStock: true,
      rating: 4.1,
      reviewCount: 278,
      image: '/uploads/free_ai_lorem_ipsum_generator_deluxe.svg'
    },
    {
      name: 'Infinite Loop Detector',
      description: 'Megállítja a végtelen ciklusokat, mielőtt a számítógéped füstölni kezdene.',
      price: 349.99,
      category: 'Software',
      inStock: true,
      rating: 4.6,
      reviewCount: 94,
      image: '/uploads/free_ai_infinite_loop_detector.svg'
    },
    {
      name: 'Semicolon Recovery Kit',
      description: 'Sürgősségi készlet hiányzó pontosvesszőkhöz. Mentett már meg több programozó karriert.',
      price: 99.99,
      category: 'Emergency Kit',
      inStock: false,
      rating: 3.9,
      reviewCount: 187,
      image: '/uploads/free_ai_semicolon_recovery_kit.svg'
    }
  ];

  // Clear existing products first
  await prisma.product.deleteMany({});
  console.log('🗑️  Cleared existing products');

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    console.log(`✅ Product created: ${product.name}`);
  }

  console.log('🎉 Database seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@qalab.hu / admin123');
  console.log('User:  user@qalab.hu / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
