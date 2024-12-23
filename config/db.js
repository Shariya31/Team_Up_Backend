import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, { dbName: 'TeamUp'});
    console.log(`Db is connected to ${conn.connection.host}`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw new Error(err.message);
    process.exit(1)
  }
};
export default connectDB