import mongoose from 'mongoose';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import couponModel from './models/couponModel.js';

// Connect to database
connectDB();

const coupons = [
  // === FREE DELIVERY COUPONS ===
  {
    code: "FREEDEL",
    type: "delivery",
    value: 100,
    minOrder: 0,
    maxDiscount: null,
    expiryDate: null,
    usageLimit: null,
    isActive: true
  },
  {
    code: "FREESHIP",
    type: "delivery",
    value: 100,
    minOrder: 200,
    maxDiscount: null,
    expiryDate: new Date('2026-12-31'),
    usageLimit: null,
    isActive: true
  },
  
  // === PERCENTAGE DISCOUNT COUPONS ===
  {
    code: "RADHE10",
    type: "percent",
    value: 10,
    minOrder: 200,
    maxDiscount: 100,
    expiryDate: null,
    usageLimit: null,
    isActive: true
  },
  {
    code: "RADHE15",
    type: "percent",
    value: 15,
    minOrder: 500,
    maxDiscount: 200,
    expiryDate: null,
    usageLimit: null,
    isActive: true
  },
  {
    code: "RADHE20",
    type: "percent",
    value: 20,
    minOrder: 1000,
    maxDiscount: 300,
    expiryDate: null,
    usageLimit: null,
    isActive: true
  },
  
  // === FLAT DISCOUNT COUPONS ===
  {
    code: "FIRST50",
    type: "flat",
    value: 50,
    minOrder: 300,
    maxDiscount: null,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 100,
    isActive: true
  },
  {
    code: "SAVE100",
    type: "flat",
    value: 100,
    minOrder: 500,
    maxDiscount: null,
    expiryDate: null,
    usageLimit: null,
    isActive: true
  },
  {
    code: "SAVE200",
    type: "flat",
    value: 200,
    minOrder: 1000,
    maxDiscount: null,
    expiryDate: null,
    usageLimit: null,
    isActive: true
  },
  {
    code: "SAVE300",
    type: "flat",
    value: 300,
    minOrder: 1500,
    maxDiscount: null,
    expiryDate: null,
    usageLimit: null,
    isActive: true
  },
  
  // === SPECIAL OCCASION COUPONS ===
  {
    code: "WELCOME50",
    type: "flat",
    value: 50,
    minOrder: 250,
    maxDiscount: null,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 500,
    isActive: true
  },
  {
    code: "NEWUSER",
    type: "percent",
    value: 25,
    minOrder: 300,
    maxDiscount: 150,
    expiryDate: new Date('2026-12-31'),
    usageLimit: 1000,
    isActive: true
  },
  {
    code: "HEALTH25",
    type: "percent",
    value: 25,
    minOrder: 600,
    maxDiscount: 250,
    expiryDate: null,
    usageLimit: null,
    isActive: true
  }
];

const seedCoupons = async () => {
  try {
    console.log('🌱 Starting coupon seeding...');
    
    // Clear existing coupons (optional - comment out if you want to keep existing)
    // await couponModel.deleteMany({});
    // console.log('🗑️  Cleared existing coupons');
    
    // Insert coupons one by one to handle duplicates
    let added = 0;
    let skipped = 0;
    
    for (const coupon of coupons) {
      const exists = await couponModel.findOne({ code: coupon.code });
      
      if (exists) {
        console.log(`⏭️  Skipped ${coupon.code} - already exists`);
        skipped++;
      } else {
        await couponModel.create(coupon);
        console.log(`✅ Added ${coupon.code} - ${coupon.type} (₹${coupon.value}${coupon.type === 'percent' ? '%' : ''}) - Min: ₹${coupon.minOrder}`);
        added++;
      }
    }
    
    console.log('\n✨ Seeding Complete!');
    console.log(`📊 Added: ${added} coupons`);
    console.log(`⏭️  Skipped: ${skipped} coupons (already existed)`);
    console.log(`📋 Total: ${added + skipped} coupons processed`);
    
    // Display all active coupons
    console.log('\n🎫 ACTIVE COUPONS:');
    console.log('==========================================');
    const allCoupons = await couponModel.find({ isActive: true }).sort({ type: 1, minOrder: 1 });
    
    console.log('\n🚚 FREE DELIVERY:');
    allCoupons.filter(c => c.type === 'delivery').forEach(c => {
      console.log(`  ${c.code.padEnd(15)} - Free delivery (Min order: ₹${c.minOrder}) ${c.expiryDate ? `[Expires: ${c.expiryDate.toLocaleDateString()}]` : '[No expiry]'}`);
    });
    
    console.log('\n💰 FLAT DISCOUNTS:');
    allCoupons.filter(c => c.type === 'flat').forEach(c => {
      console.log(`  ${c.code.padEnd(15)} - ₹${c.value} off (Min order: ₹${c.minOrder}) ${c.usageLimit ? `[Limited: ${c.usageLimit} uses]` : '[Unlimited]'}`);
    });
    
    console.log('\n📊 PERCENTAGE DISCOUNTS:');
    allCoupons.filter(c => c.type === 'percent').forEach(c => {
      console.log(`  ${c.code.padEnd(15)} - ${c.value}% off (Min order: ₹${c.minOrder}, Max: ₹${c.maxDiscount || '∞'}) ${c.usageLimit ? `[Limited: ${c.usageLimit} uses]` : '[Unlimited]'}`);
    });
    
    console.log('\n==========================================');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding coupons:', error);
    process.exit(1);
  }
};

// Run the seed function
seedCoupons();
