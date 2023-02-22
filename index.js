// import files from packages
const express =require('express');
const mongoose =require('mongoose');



//imports from other files
const authRouter =require("./routes/auth.js");
const adminRouter = require("./routes/admin");
const productRouter=require("./routes/product");
const userRouter = require('./routes/user.js');

//INIT
const PORT = process.env.PORT || 3000;
const app =express();
const DB="mongodb+srv://prateek:7728335@cluster0.yykurn7.mongodb.net/?retryWrites=true&w=majority";

//middleware
//Client ->middleware(to manupilate the data that to be send to the server) ->SERVER ->CLIENT
app.use(express.json());//should be done before authrouter.Done for destructuring the object.
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);


//Connetions
mongoose.connect(DB).then(()=>{// to connect to mongoose.
    console.log("connection successful to mongoose");
}).catch((e) =>{
    console.log(e);
});

app.listen(PORT,"0.0.0.0",() =>{
    console.log("connected to port : " + PORT);
});