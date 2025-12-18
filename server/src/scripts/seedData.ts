import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Product from '../models/Product';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@modesta.com',
      password: hashedPassword,
      role: 'admin',
      preferences: {
        style: ['elegant', 'modest', 'luxury'],
        colors: ['black', 'navy', 'beige'],
        occasions: ['formal', 'business', 'casual'],
        budget: 'luxury'
      }
    });

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', salt);
    const customerUser = await User.create({
      name: 'Sarah Ahmed',
      email: 'customer@modesta.com',
      password: customerPassword,
      role: 'customer',
      preferences: {
        style: ['elegant', 'modern', 'modest'],
        colors: ['emerald', 'burgundy', 'gold'],
        occasions: ['formal', 'party', 'wedding'],
        budget: 'luxury'
      },
      measurements: {
        height: 165,
        bust: 90,
        waist: 70,
        hips: 95
      }
    });

    console.log('Users created:', adminUser.email, customerUser.email);

    // Create sample products
    const products = [
      {
        name: 'Elegant Emerald Abaya',
        description: 'Luxurious flowing abaya in rich emerald green with delicate gold embroidery',
        category: 'Outerwear',
        subcategory: 'Abayas',
        price: 299.99,
        images: [
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Emerald Green', 'Navy Blue', 'Burgundy'],
        material: '100% Premium Silk',
        brand: 'MODESTA Luxury',
        stock: 25,
        tags: ['elegant', 'formal', 'silk', 'embroidered'],
        modestyLevel: 'high',
        occasions: ['formal', 'wedding', 'party'],
        style: ['elegant', 'luxury', 'modest'],
        featured: true,
        ratings: {
          average: 4.8,
          count: 45
        }
      },
      {
        name: 'Classic Black Hijab - Premium Chiffon',
        description: 'Lightweight breathable premium chiffon hijab, perfect for everyday wear',
        category: 'Hijabs',
        subcategory: 'Everyday Hijabs',
        price: 29.99,
        images: [
          'https://images.unsplash.com/photo-1601924287940-339a75c3fb67?w=500'
        ],
        sizes: ['One Size'],
        colors: ['Black', 'White', 'Navy', 'Beige', 'Grey'],
        material: 'Premium Chiffon',
        brand: 'MODESTA Essentials',
        stock: 100,
        tags: ['hijab', 'everyday', 'lightweight', 'breathable'],
        modestyLevel: 'high',
        occasions: ['casual', 'business', 'daily'],
        style: ['classic', 'modest', 'simple'],
        featured: true,
        ratings: {
          average: 4.9,
          count: 230
        }
      },
      {
        name: 'Royal Burgundy Evening Kaftan',
        description: 'Stunning burgundy kaftan with intricate beadwork and flowing silhouette',
        category: 'Dresses',
        subcategory: 'Kaftans',
        price: 449.99,
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
          'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Burgundy', 'Royal Blue', 'Emerald Green'],
        material: 'Silk Blend with Beading',
        brand: 'MODESTA Couture',
        stock: 15,
        tags: ['kaftan', 'formal', 'beaded', 'evening'],
        modestyLevel: 'high',
        occasions: ['formal', 'wedding', 'gala', 'party'],
        style: ['elegant', 'luxury', 'royal'],
        featured: true,
        ratings: {
          average: 5.0,
          count: 67
        }
      },
      {
        name: 'Modest Business Blazer Set',
        description: 'Professional two-piece blazer and pants set in structured fabric',
        category: 'Sets',
        subcategory: 'Business Wear',
        price: 189.99,
        images: [
          'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Charcoal Grey', 'Camel'],
        material: 'Premium Wool Blend',
        brand: 'MODESTA Professional',
        stock: 40,
        tags: ['blazer', 'professional', 'business', 'formal'],
        modestyLevel: 'medium',
        occasions: ['business', 'formal', 'office'],
        style: ['modern', 'professional', 'elegant'],
        featured: false,
        ratings: {
          average: 4.7,
          count: 89
        }
      },
      {
        name: 'Flowing Maxi Dress - Summer Collection',
        description: 'Light and airy maxi dress perfect for warm weather occasions',
        category: 'Dresses',
        subcategory: 'Maxi Dresses',
        price: 129.99,
        images: [
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Floral Print', 'Solid Beige', 'Mint Green', 'Lavender'],
        material: 'Cotton Blend',
        brand: 'MODESTA Summer',
        stock: 60,
        tags: ['maxi', 'casual', 'summer', 'comfortable'],
        modestyLevel: 'high',
        occasions: ['casual', 'outdoor', 'brunch', 'shopping'],
        style: ['casual', 'modest', 'comfortable'],
        featured: false,
        ratings: {
          average: 4.6,
          count: 134
        }
      },
      {
        name: 'Gold Embellished Occasion Dress',
        description: 'Sophisticated dress with gold embellishments for special occasions',
        category: 'Dresses',
        subcategory: 'Occasion Wear',
        price: 379.99,
        images: [
          'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black with Gold', 'Navy with Gold', 'Emerald with Gold'],
        material: 'Silk with Gold Embroidery',
        brand: 'MODESTA Occasion',
        stock: 20,
        tags: ['embellished', 'formal', 'gold', 'occasion'],
        modestyLevel: 'high',
        occasions: ['party', 'wedding', 'formal', 'gala'],
        style: ['elegant', 'luxury', 'glamorous'],
        featured: true,
        ratings: {
          average: 4.9,
          count: 78
        }
      },
      {
        name: 'Casual Tunic Top',
        description: 'Comfortable and modest tunic perfect for everyday wear',
        category: 'Tops',
        subcategory: 'Tunics',
        price: 59.99,
        images: [
          'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Navy', 'Olive', 'Dusty Rose'],
        material: 'Cotton Jersey',
        brand: 'MODESTA Basics',
        stock: 85,
        tags: ['tunic', 'casual', 'everyday', 'comfortable'],
        modestyLevel: 'medium',
        occasions: ['casual', 'daily', 'shopping', 'errands'],
        style: ['casual', 'comfortable', 'simple'],
        featured: false,
        ratings: {
          average: 4.5,
          count: 201
        }
      },
      {
        name: 'Premium Silk Prayer Set',
        description: 'Luxurious two-piece prayer set in soft silk with carrying pouch',
        category: 'Prayer Wear',
        subcategory: 'Prayer Sets',
        price: 89.99,
        images: [
          'https://images.unsplash.com/photo-1609156429936-86b69d7dcbc0?w=500'
        ],
        sizes: ['One Size'],
        colors: ['White', 'Cream', 'Light Pink', 'Lavender'],
        material: 'Pure Silk',
        brand: 'MODESTA Spiritual',
        stock: 45,
        tags: ['prayer', 'spiritual', 'silk', 'luxury'],
        modestyLevel: 'high',
        occasions: ['prayer', 'spiritual'],
        style: ['spiritual', 'modest', 'simple'],
        featured: false,
        ratings: {
          average: 5.0,
          count: 156
        }
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n========================================');
    console.log('✓ Database seeded successfully!');
    console.log('========================================\n');
    console.log('Test Credentials:');
    console.log('-------------------');
    console.log('Admin:');
    console.log('  Email: admin@modesta.com');
    console.log('  Password: admin123\n');
    console.log('Customer:');
    console.log('  Email: customer@modesta.com');
    console.log('  Password: customer123\n');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();