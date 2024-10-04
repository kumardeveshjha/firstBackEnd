import { User } from "../models/user.model.js";
import { ApiError } from "../utils/APIerrors.js";
import { asyncHandler } from "../utils/asynchHandler.js";
import jwt from "jsonwebtoken"

export const verifyToken = asyncHandler(async(req, _ ,next)=>{
     try {
          console.log("Request headers:", req.headers);
          console.log("Request cookies:", req.cookies);
          console.log("Request Body:", req.body);

          const token = req.cookies?. || req.header("Authorization")?.replace("Bearer ","");;    // this is from jwt 
         console.log("Token:",token);
         console.log("Request headers:", req.headers);
         console.log("Request cookies:", req.cookies);

          if(!token){
               throw new ApiError(401,"Unauthorized request");
          }
        
         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         
       
     
        const user =  await User.findById(decodedToken?._id).      // here id is the refrence from the database in model 
         select("-password  -refreshToken");
         
         console.log(decodedToken);
     
         if(!user){
          console.log("user not found");
          throw new ApiError(401,"Invalid access Token");
         }
     
         req.user = user    // if user is valid then add the information ofthe user 
         next()
     } catch (error) {
          console.log("Error:", error)
          throw new ApiError(401, error?.message|| "invalid access token ")
     }

})