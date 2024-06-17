import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
// import bcrpyt from "bcrpyt";
import { Task,User } from "./database/dataSchema.js";
const route = express.Router();
const app=express();
app.use(express.static(path.join(path.resolve(),'public')));
route.get("/login",(req,res)=>{
    res.render("login")
})
route.get("/signup",(req,res)=>{
    res.render("signup");
})
function Authentication(req,res,next){
    let token=req.cookies.val;
    // console.log(token);
    if(token){
        next();
    }
    else{
        res.redirect("/");
    }
}
route.get("/profile",Authentication,async(req,res)=>{
   
    try {
        // console.log(req.cookies);
    let token = req.cookies.val
    if(!token){
        res.redirect('/');
        return;
    }
    let decode = jwt.verify(token,process.env.SECRET_KEY,{
     complete:true,
    });
    let nwID=decode.payload._id
    // console.log(nwID);
    let task= await Task.find({ID:nwID});
    res.render("profile",{task:task});
        
    } catch (error) {
        console.log(error);
    }
})

// Add a Task 
route.post("/task/add",Authentication,async (req,res)=>{
      try{
        let token = req.cookies.val
        let decode = jwt.verify(token,process.env.SECRET_KEY,{
         complete:true,
        });
        let nwID=decode.payload._id;
        let temp = await Task.create({
         title:req.body.work,
         desc:req.body.desc,
         ID:nwID,
        })
        res.redirect("/user/profile");
      }
      catch(err){
        console.log(err);
      }
})

//Delete task
route.delete("/task/delete/:id",Authentication,async(req,res)=>{
   try { 
    let id =req.params.id;
    // console.log(id);
     await Task.deleteOne({_id:id});
    res.redirect("/user/profile");
    
   } catch (error) {
    console.log(error)
   }
})

function genCookie(user,res){
    let token =jwt.sign({_id:user._id},process.env.SECRET_KEY)
    res.cookie("val",token,{
        httpOnly:true,
        expires:new Date(Date.now()+10*60*100000),
        sameSite:process.env.NODE_ENV==="development"?"lax":"none",
        secure:process.env.NODE_ENV==="development"?false:true,
    })
}
//Update Task
// route.put("/task/update/:id",Authentication,async(req,res)=>{
//     try { 
//         let task=req.body;
//         task.title=req.body.title,
//         task.desc=req.body.desc,
//         task.ID=req.body.ID,
//         task.done=!req.body.done,
//         task=await task.save(),
//      res.redirect("/user/profile");
//     } catch (error) {
//      console.log(error)
//     }
//  })
 
// User Login 
route.post("/login",async (req,res)=>{
    try {
        let user =await User.findOne({email:req.body.email});
    if(user){
        if(req.body.password===user.password){
            genCookie(user,res);
            res.redirect("/user/profile");
        }
        else{
            res.render("login",{msg:"Incorrect Password",email:req.body.email})
        }

    }
    else{
       res.render("login",{msg:"Not A User Please Sign Up",link:"/user/signup"})
    }
        
    } catch (error) {
        console.log(error)
        
    }
})

// Sign Up
route.post("/signup",async(req,res)=>{
   try {
    let user= await User.findOne({email:req.body.email});
    if(user){
        res.render("signup",{msg:"Already a user please login ",link:"/user/login"})
    }
    else{
        // let pas=await bcrpyt.hash(req.body.password,10);
        let user= await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
        })
       genCookie(user,res);
        res.redirect("/user/profile")
    }
    console.log(user);
   } catch (error) {
    console.log(error)
   }
})
// delete User
route.get('/logout',Authentication,(req,res)=>{
    res.cookie("val","",{
        httpOnly:true,
        expires:new Date(Date.now()),
        sameSite:process.env.NODE_ENV==="development"?"lax":"none",
        secure:process.env.NODE_ENV==="development"?false:true,
    })
    res.redirect("/");
})
export default route;