import mongoose from 'mongoose';

const connectDB = async (uri) => {
//   const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/TeamUp';
  try {
    const conn = await mongoose.connect(uri, { dbName: 'TeamUp' });
    console.log(`Db is connected to ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
