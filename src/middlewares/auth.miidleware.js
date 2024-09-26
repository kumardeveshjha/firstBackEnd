import { User } from "../models/user.model.js";
import { ApiError } from "../utils/APIerrors.js";
import { asyncHandler } from "../utils/asynchHandler.js";
import jwt from "jsonwebtoken"

export const verifyToken = asyncHandler(async(req,res,next)=>{
     try {
          const token = req.cookies?.accessToken || req.header
          ("Authorization")?.replace("Bearer ","");    // this is from jwt 
         
          if(!token){
               throw new ApiError(401,"Unauthorized request");
          }
        
         const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     
        const user =  await User.findById(decodedToken?._id).      // here id is the refrence from the database in model 
         select("-password  -refreshToken");
     
         if(!user){
          throw new ApiError(401,"Invalid access Token");
         }
     
         req.user = user
     
         next()
     } catch (error) {
          throw new ApiError(401, error?.message|| "invalid access token ")
     }

})