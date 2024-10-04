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

// here we will define the tokens access and refresh 

const generateAccessAndRefreshTokens = async (userId)=>{
      try {
            const user = await User.findById(userId);   // here user is imported as an object
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()
           
            user.refreshToken = refreshToken;  // added the refresh token in user object 
            user.save({validateBeforeSave: false})

            return {accessToken, refreshToken}  

      } catch (error) {
            throw new ApiError(500,"Something went wrong while generating refresh and access token");
      }
}


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

if(!username && !email) {
      throw new ApiError(400,"Username or email is required")
}

const user = await User.findOne({    // user is the imported User from model 
      $or : [{ username },{ email }]     // $or is the mongoDb oparator
}                                    
)

if(!user){
      throw new ApiError(400,"The user does not found");
}


// This is the method you created wchich you returns from database
const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);
  console.log(user.password)
  console.log(password);
  
// if user password is not correct then throw error 
// if(!isPasswordValid){
//       throw new ApiError(400,"PLease enter correct password ");
// }

// Now we can take the access and refresh token 

const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)  // here we have destructured it 
const loggedInUser = await User.findById(user._id).
select("-password -refreshToken")          // so now this is the details and all fields which we have to send the logged user

// Now cookies 
const options = {
      httpOnly: true,        // by these two properies the cokkies can only be modified from server 
      secure: true          // user can not modify the cookies
}

return res.
status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken, options)
.json(                        // optional 
      new APIResponse(       // this is so the user can change the cookies 
            200,
            {
                  user: loggedInUser, accessToken,
                  refreshToken
            },
            "User Has been logged in successfully"
      )
)

})


// Now for logOut user 

const logoutUser = asyncHandler(async(req,res)=>{
      // First we have to remove the cookies for logout
      // we have to reset the tokens 

     await User.findByIdAndUpdate(
      req.user._id,
      {
            $set:{
                  refreshToken: undefined
            }
      },
      {
            new: true
      }

     )

     const options = {
      httpOnly: true,        // by these two properies the cokkies can only be modified from server 
      secure: true          // user can not modify the cookie 
    }

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken",refreshToken, options)
.json(new APIResponse(200, {}, "user loggedout"));




})





export {
      registerUser,
      userlogin,
      logoutUser
    }
