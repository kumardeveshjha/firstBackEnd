import { asyncHandler } from "../utils/asynchHandler.js";
import { ApiError } from "../utils/APIerrors.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/clodinary.js"
import { APIResponse } from "../utils/APIResponse.js";


// this was a sample registration
// const registerUser = asyncHandler( async(req,res)=>{
//      return res.status(200).json({       // this is success message 
//           message:"The user has been registered"
//      })
// })


// user registration 


const  registerUser = asyncHandler( async(req,res)=>{
      // get user details from frontend
      // validation - not empty
      // check if user already registered: username,email
      //check for images, check for avtar
      //upload them to clodinary, avatar 
      // create user object - create entry in db
      // remove password and refresh token field from response 
      // check for user creation
      // return response 

      const {userName,email,fullName,password} = req.body
      console.log("email:",email,"Fullname:", fullName,"password:",password);
      
      // check
      console.log('req.files:', req.files);
      
      // Here we are validat in the the details and also cjhecking for the information we called APIerror module as
      // if (fullName==="") {
      //       throw new ApiError(400,"full name is required")       // this is the conventional method to check for the the validation
      // }


      // // now we will write for the advance method to check for validation 

      if(
            [userName,email,fullName,password].some((field)=>{
                  field?.trim()==="";
            })
      ){
            throw new ApiError(400,"All fields are required");
      }

      const existingUser = await User.findOne({
            $or :[{ userName }, { email }]   // to check for the existing user we use find methos 
      })

      if(existingUser){
            throw new ApiError(409,"The user already existed")
      }
      

      //  for the path of avatar and files which are to be uploaded (advance method using optional chaining)
      const localAvatarPath = req.files?.avatar[0]?.path;
      const localCoverImagePath  = req.files?.coverImage[0]?.path
      

      // to avoid optional chaining we use following code 
      /* let localCoverImagePath;
      if(req.files && Array.isArray(req.files.coverImage) 
            && req.files.coverImage.length > 0){
            localCoverImagePath = req.files.coverImage[0].path
      }
      */
      
      // check for the avatar 
      if(!localAvatarPath){
            throw new ApiError(400,"Avatar is missing*")  // check for the avatar
      }
      
      // // check for the Cover Image 
      // if(!localCoverImagePath){
      //       throw new ApiError(400,"Cover Image is Required*")
      // }
 
      // // upload the files on cloudinary we use await becuase it will take time to upload on cloudinary 
      // // 
      const avatar = await uploadOnCloudinary(localAvatarPath);
      const coverImage = await uploadOnCloudinary(localCoverImagePath);
      
      if(!avatar){
            throw new ApiError(400,"Avatar image does not uploaded")
      }
      // if(!coverImage){
      //       throw new ApiError(400,"Cover image does not uploaded")
      // }

     const user = await User.create({
            fullName,
            email,
            avatar: avatar.url,
            coverImage: coverImage?.url || "", // this is to check for the coverImage uploaded or not
            password,
            userName: userName.toLowerCase()

      })
       
      const storedUser = await User.findById(user._id).select(
            "-password -refreshToken"    // this is to remove password and refresh token from the stored database 
      )
      if(!storedUser){
            throw new ApiError(500,"Something went wrong while registering the user")
      }

      return res.status(201).json(
            new APIResponse(200,storedUser,"User has been created")
      )
    

}) 


// Login User

const userlogin = asyncHandler( async(req,res)=> {
      //req body -->data
      //username or email
      //find the user 
      // password check
      // access and refresh token
      // send cookie 


const {email,username,password} = req.body

if(!username || !email) {
      throw new ApiError(400,"Username or email is required")
}

const user = await User.findOne({
      $or : [{username},{email}]
}
)

if(!user){
      throw new ApiError(400,"The user does not found");
}







})





export {registerUser}
