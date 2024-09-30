// import mongoose from "mongoose"

import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from  'bcrypt'


const userSchema = new Schema(
     {
         userName:{
          type:String,
          required: true,
          unique:true,
          lowercase: true,
          trim: true,
          index: true
         },
         email: {
          type:String,
          required:  [true,"Email is required"],
          unique:  true,
          lowercase:  true,
          trim:  true
         },
         fullName:{
          type: String,
          required: [true, "FullName is required"],
          trim:  true,
          index:  true
         },
         avatar:{
          type: String, // cloudenary url
          required:  true,
          
         },
         coverImage:{
          type: String, // cloudenary url
         },
         watchHistory:{
          type: Schema.Types.ObjectId,
          ref:"Video"
         },
         password:{
          type: String,
          required: [true, 'Password is required']
         },
         refreshToken:{
          type: String
         }
     },{timestamps:true})

userSchema.pre("save", async function (next){        // pre is a hook which executes just before we save any data // also don't use arrow function here 
        if(this.isModified("password")){                   // here we will encrypt the password 
            this.passwrord = await bcrypt.hash(this.password,10)
        }
        next()
     })


     // costum method 
    
userSchema.methods.isPasswordCorrect = async function (password){
        
        return await bcrypt.compare(password,this.password);     // here first password is the password which will be entered by the user second id the database password
        
     }
    
    
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            fullname: this.fullName,
            username: this.userName

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this.id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)