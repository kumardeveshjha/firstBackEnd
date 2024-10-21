import { asyncHandler } from "../utils/asynchHandler.js";
import { ApiError } from "../utils/APIerrors.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/clodinary.js"
import { APIResponse } from "../utils/APIResponse.js";
import jwt from "jsonwebtoken"

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
            user.accessToken = accessToken;
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
if(!isPasswordValid){
      throw new ApiError(400,"PLease enter correct password ");
}

// Now we can take the access and refresh token 

const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)  // here we have destructured it 
const loggedInUser = await User.findById(user._id).
select("-password -refreshToken")          // so now this is the details and all fields which we have to send the logged user
console.log(accessToken,refreshToken);
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
      
      // const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(User._id);

      // alternative method to use Tokens
      const accessToken = req.cookies.accessToken || req.body.accessToken
      const refreshToken = req.cookies.refreshToken || req.body.refreshToken
      console.log(accessToken,refreshToken);
      // console.log(accessToken,refreshToken)
     await User.findByIdAndUpdate(
      req.user._id,                  // here finding the user to update
      {
            $set:{
                  refreshToken: undefined
            }
      },
      {
            new: true
      }

     )
     console.log()
    const options = {
      httpOnly: true,        // by these two properies the cokkies can only be modified from server 
      secure: true          // user can not modify the cookie 
    }

return res
.status(200)
.clearCookie("accessToken",accessToken, options)
.clearCookie("refreshToken",refreshToken, options)
.json(new APIResponse(200, {}, "user loggedout"));




})


const refreshAceessToken = asyncHandler(async(req,res)=>
{
    try {
      const incomingRefreshToken = await req.cookies.refreshToken || req.body.refreshToken;
      console.log("incomingRefreshToken",incomingRefreshToken);
      

      if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
      }
  
     const decodedToken =  jwt.verify(
        incomingRefreshToken, 
        process.env.REFRESH_TOKEN_SECRET
      )
  
      const user = await User.findById(decodedToken?._id)
  
      if(!user){
        throw new ApiError(401,"RefreshToken is Expired or used");
      }
  
      const options = {
        httpOnly : true,
        secure: true
      }
  
      // const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(User._id);
      const newRefreshToken = await req.cookies.refreshToken || req.body.refreshToken;
      const accessToken = await req.cookies.accessToken || req.body.accessToken
     
      console.log("newRefreshToken",newRefreshToken,accessToken)
      return res.status(200)
      .cookie("accessToken",accessToken, options)
      .cookie("newRefreshToken", newRefreshToken, options)
      .json(
        new APIResponse(
              200,
              {accessToken, refreshToken: newRefreshToken},
              "Access Token Refreshed"
        )
      )
    } catch (error) {
      console.log(error)
        throw new ApiError(400,"invalid Refresh token")
    }
}
);

const changeCurrentPassword = asyncHandler( async(req,res)=>{
      const {oldPassword, newPassword, confPassword} = req.body;
 
     const user  = await User.findById(req.user?._id);
     const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
//      if(!(newPassword === confPassword)){
//           throw new ApiError(400," The password didn't matched");
//      }
     if(!isPasswordCorrect){
      throw new ApiError(400, "Invalid Password")
     }

     user.password = newPassword;
     await user.save({validateBeforeSave:false})

     return res
     .status(200)
     .json(new APIResponse(200,{},"Password changed"))


})

const getCurrentUser = asyncHandler(async(req,res) =>{
      return res
      .status(200)
      .json(200, req.user, "Current user found")
})



// this is to update only the data about user 
const updateAcoountInfo = asyncHandler( async(req,res) => {
      const {fullName,userName, email} = req.body;

      if(!(fullName || userName)){
            throw new ApiError(400,"All fields are required !!");
      }

      const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                  $set: {
                        fullName,    // or we can use  fullName: fullName
                        email,
                        userName
                  }
            },
            {new: true}     // Information after update returns here
      ).select("-password")

      return res
      .status(200)
      .json(new APIResponse(200, user, "User details has been updated successfully "))
})


// this is to update the files in the user 
const updateAvatar = asyncHandler( async(req,res)=>{
      
      // first we will get the path of the file and this can be get through multer middleware
      
      const avatarLocalPath  = req.file?.path; 

      if(!avatarLocalPath){
            throw new ApiError(400, "The avatar file is not available")
      }


      const avatar = await uploadOnCloudinary(avatarLocalPath);

      if(!avatar.url){
            throw new ApiError(400, "Error while uploading avatar ")
      }
   
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
            $set:{
                  avatar: avatar.url
            }
      },
      {new:true}
   ).select("-password");

   return res
   .status(200)
   .json(APIResponse(200,user, "The avatar has been updated successfully"))

});

const updateCoverImage = await asyncHandler(async(req,res)=>{
     const coverImageLocalPath = req.file?.path;
     console.log(coverImageLocalPath);
     
     if(coverImageLocalPath){
      throw new ApiError(400,"Cover Image Local path does not found")
     }

     const coverImage = await uploadOnCloudinary(coverImageLocalPath);
//      console.log(coverImage.url);
     
     if(!coverImage.url){
      throw new ApiError(400, "The coverImage url not found");
     }

     const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
            $set: {
                  coverImage: coverImage.url
            }
      },
      {new: true}
     ).select("-password")

     return res
     .status(200)
     .json(APIResponse(200,user,`The coverImage of ${user.fullName} has been updated`))
})









export {
      registerUser,
      userlogin,
      logoutUser,
      refreshAceessToken,
      changeCurrentPassword,
      updateAcoountInfo,
      getCurrentUser,
      updateAvatar,
      updateCoverImage

}
