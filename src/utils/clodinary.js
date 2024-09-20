// this is reuseable code 
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"     // this is file system can be used directly becuase it is available in the node

cloudinary.config({ 
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
 })

 const uploadOnCloudinary = async (localFilePath) => {
     try {
          if(!localFilePath) return null
          // upload the file on cloudinary
          const response = await cloudinary.uploader.upload(localFilePath, {
               resource_type:"auto"    // now it will autodetect the type of the file uploaded
          })
           // file has been uploaded successfully
           console.log("file has been uploaded on 'cloudinary' successfully", response.url);
           return response

     } catch (error) {
          fs.unlinkSync(localFilePath) //  it will remove the remotely saved temporary file as the upload operation got failed
          return null;   
     }
 }

 export {uploadOnCloudinary}