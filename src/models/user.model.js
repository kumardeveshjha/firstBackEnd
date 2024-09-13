// import mongoose from "mongoose"

import mongoose,{Schema} from "mongoose";

const userSchema = new Schema(
     {
         uerName:{
          type:String,
          required: true,
          unique:True,
          lowercase: true,
          trim: true,
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
          required: true,
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

userSchema.pre("save", async function (next){      
        if(this.isModfied("password")){                   // here we will encrypt the password 
            this.passwrord = bcrypt.hash(this.password,10)
        }
        next()
     })


     // costum method 
    
userSchema.methods.isPasswordCorrect = async function (password){
        return await bcrypt.compare(password,this.password)
     }
userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            
        }
    )
}
userSchema.methods.generateAccessToken = function(){}

export const User = mongoose.model("User",userSchema)