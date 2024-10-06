import { User } from "../models/user.model.js";
import { ApiError } from "../utils/APIerrors.js";
import { asyncHandler } from "../utils/asynchHandler.js";
import jwt from "jsonwebtoken"

// authentication middleware 

export const verifyToken = asyncHandler(async(req,res,
     next)=>{
         try {
          const token =  req.cookies?.accessToken || req.header
          ("Authorization")?.replace("Bearer ", "")
         
         console.log(token)
          if(!token){
               throw new ApiError(401,"Unauthorized Request")
          }


          const decodedToken  = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

          const user = await User.findById(decodedToken?._id).
               select("-password -refreshToken"))
          
          console.log(user)
          if(!user){
               throw new ApiError(401,"Invalid Access Token")
          }

          req.user = user;
          next();
     
         }
          catch (error) {
          
         }
         
     })