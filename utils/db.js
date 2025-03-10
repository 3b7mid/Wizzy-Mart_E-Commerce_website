import mongoose from "mongoose";
import 'dotenv/config';

const dbConnection = async () => {
    const URI = process.env.MONGO_URI;
    await mongoose.connect(URI)
    console.log(`Database connected successfully`);
};

export default dbConnection;