import mongoose from "mongoose";
const task= new mongoose.Schema({
    title:String,
    desc:String,
    ID:String,
    done:{
        type:Boolean,
        default:true,
    },
})
const Task= new mongoose.model("Task",task);
const user=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
         type:String,
         required:true,
    }
})
const User= new mongoose.model("User",user);
export {Task,User}