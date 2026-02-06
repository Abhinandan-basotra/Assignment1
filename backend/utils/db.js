import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log(process.env.MONGO_URI);
        
        await mongoose.connect("mongodb://localhost:27017");
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

export default connectDb;