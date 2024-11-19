import mongoose from "mongoose";

export const connectDB = async(uri)=>{
    await mongoose.connect(uri,{
        dbName: "TeamUp"
    }).then(c => console.log(`Db is connected to ${c.connection.host}`)).catch(e => console.log(e))
}