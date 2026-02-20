import mongoose from "mongoose";
import 'dotenv/config';
import userModel from "./models/userModel.js";

const cleanDatabase = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
        
        console.log("🗑️  Dropping old users collection...");
        await mongoose.connection.collection('users').drop();
        console.log("✅ Old users collection removed");
        
        console.log("🔄 Creating new collection with fresh schema...");
        await userModel.createIndexes();
        console.log("✅ New collection created with correct indexes");
        
        console.log("\n✨ Database cleanup complete!");
        console.log("You can now use the new OTP login system.");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

cleanDatabase();
