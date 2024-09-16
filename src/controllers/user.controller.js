import { asyncHandler } from "../utils/asynchHandler.js";


const registerUser = asyncHandler( async(req,res)=>{
     return res.status(200).json({       // this is success message 
          message:"The user has been registered"
     })
})


export {registerUser}
