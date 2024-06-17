import mongoose from "mongoose";
 const MongoConnection=()=>mongoose.connect(process.env.MONGO_URI,{
    dbName:process.env.DB_NAME,
 }).then(()=>{
    console.log("connected to Mongo");
})
.catch((e)=>{
    console.log(e);
})
export default MongoConnection;


