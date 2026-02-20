import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        // Auto-cleanup: Drop old indexes if they exist
        setTimeout(async () => {
            try {
                const collection = mongoose.connection.collection('users');
                const indexes = await collection.listIndexes().toArray();
                
                // Check for old email index
                const hasEmailIndex = indexes.some(idx => idx.name === 'email_1');
                if (hasEmailIndex) {
                    await collection.dropIndex('email_1');
                }
                
                // Check for phoneNumber unique index (now should be non-unique)
                const hasPhoneNumberIndex = indexes.some(idx => idx.name === 'phoneNumber_1');
                if (hasPhoneNumberIndex) {
                    const phoneIndex = indexes.find(idx => idx.name === 'phoneNumber_1');
                    // If it's a unique index, remove it
                    if (phoneIndex && phoneIndex.unique) {
                        await collection.dropIndex('phoneNumber_1');
                    }
                }
            } catch (error) {
                // Index doesn't exist, which is fine
                if (!error.message.includes('index not found')) {
                }
            }
        }, 1000);
    });
    
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
};

export default connectDB;