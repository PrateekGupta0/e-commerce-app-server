const mongoose=require('mongoose');
const { productSchema } = require('./product');


const userSchema =mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required: true,
        trim:true,
        validate:{
            validator:(value) =>{
                //pattern for finding the email is in correct form at or not
                const re =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message:"Please enter a valid email address",
        }
    },
    password:{
        type:String,
        required:true,
    },
    address: {
        type:String,
        default:'',
    },
    type:{
        type:String,
        default:'user',
    },
    cart:[
        {
            product:productSchema,
            quantity:{
                type:Number,
                required:true,
            }
        }
    ]
});// only structure not model


//creating the model
const User =mongoose.model('User',userSchema);

module.exports=User;