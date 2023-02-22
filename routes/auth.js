const express =require("express");
const User = require("../models/user");
const bcryptjs=require('bcryptjs');
const jwt =require('jsonwebtoken');
const auth = require("../middlewares/auth");

const authRouter =express.Router();


// authRouter.get()//to get the data from server


//signup
authRouter.post("/api/signup",async (req,res) =>{
    try{
        //get the data from client
        const {name,email,password} =req.body;// this done in this way {'name' :name ,'email':email,'password':password}
        
        //user schema with model so that data can be stored in mongodb
        const existingUser=await User.findOne({email});//findone is promise so await is need ,if we find some user with same email then new user cannot use the same email.
        if(existingUser){
            //is their is a user with same email id the we can not create the new user eith same user id,
            return res.status(400).json({msg:'User with same email exists'});//this is in json format
            // if we dont specify the status code then automatically it return 200 which means all thing are correct but here this is not true.

        }
        const hashedPassword=await bcryptjs.hash(password,8 /*thsi is salt */);// we protect our passowrd we use hashing
        let user=new User({
            //creating the user model
            email,//as key and value are same the we can directly write this shorthand notation.
            password:hashedPassword,
            name,
        });
        user=await user.save();// saving the user in database therefore mongodb.it will return user with two more field therefore id and version
        res.json(user);
        //post that data in database.
        //return that data to the user
    }catch(e){
        res.status(500).json({error:e.message});// using error not msg because it is a error internal server.
    }
});


//Sign In route
//we neeed jsonwebtoken for sign in and for other authenticaton
authRouter.post("/api/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        //if user is not present in the database
        return res
          .status(400)
          .json({ msg: "User with this email does not exist!" });
      }
      
      //if user present then we need to check that the password entered by the user is correct.
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
      }
  
      const token = jwt.sign({ id: user._id }, "passwordKey");// jwt is used to conform that user is the coreect user not the hacker.
      res.json({ token, ...user._doc });// ... -> is done so that token become part of user and res.json to send this to the app.

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });


//// for token validation
//authRouter.post("/tokenIsValid", async (req, res) => {
//    try {
//      const token =req.header('x-auth-token');
//      if(!token){// is token is null,
//        return res.json(false);
//      }
//
//      const verified=jwt.verify(token,"passwordKey");
//      if(!verified){
//        return res.json(false);
//      }
//
//      // now find the user in datbase if it is present or not
//      const user=await User.findById(verified.id);
//      if(!user){
//        return res.json(false);
//      }
//
//      res.json(true);
//    } catch (e) {
//      res.status(500).json({ error: e.message });
//    }
//  });
//
//
//
//// get user data
//authRouter.get('/',auth/* this middle ensure that you are the genune use */,async (req,res) =>{
//  const user=await User.findById(req.user/*this is in auth middleware function*/);
//  res.json({token: req.token, ...user._doc});// sending the data
//});

authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data
authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports =authRouter;