import { asyncHandler } from "../utils/asynchHandler.js";
import { ApiError } from "../utils/APIerrors.js";



// this was a sample registration
// const registerUser = asyncHandler( async(req,res)=>{
//      return res.status(200).json({       // this is success message 
//           message:"The user has been registered"
//      })
// })


// user registration 

const registerUser = asyncHandler( async(req,res)=>{
      // get user details from frontend
      // validation - not empty
      // check if user already registered: username,email
      //check for images, check for avtar
      //upload them to clodinary, avatar 
      // create user object - create entry in db
      // remove password and refresh token field from response 
      // check for user creation
      // return response 

      const {username,email,fullname,password} = req.body
      console.log("email:",email,"Fullname:", fullname,"password:",password);
      
      // Here we are validatinb the the details and also cjhecking for the information we called APIerror module as
      // if (fullname=="") {
      //       throw new ApiError(400,"full name is required")       // this is the conventional method to check for the the validation
      // }

      // now we will write for the advance method to check for validation 

      if(
            [username,email,fullname,password].some((field)=>{
                  field?.trim()==""
            })
      ){
            throw new ApiError(400,"All fields are required");
      }
})





export {registerUser}
