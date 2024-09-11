

import dotenv from 'dotenv';
dotenv.config({ path: './env' });




// second aproach 
import connectDB from "./db/index.js"
connectDB()
.then(()=>{ 
   app.listen(process.env.PORT || 8000,()=>{
      console.log("Server is running at:",process.env.PORT);
      //`server is running at port ${process.env.PORT}`
      }
    )
    app.on("error",(error) => {
      console.log("ERROR",error);
      throw error;
    })
})
.catch((err)=>{
   console.log("MONGOdB connection failed",err);
   
})


   //  First aparoach to connect the database using the IIFE function 

// import mongoose from "mongoose"
// import { DB_NAME } from "./constants.js"

// import express from "express"
// const app = express();
// function connect(){}   
// connect()

// More professional approach using immediatly invoked function 

/*( async () => {
     try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)                // connecting with database here
       app.on("error", (error)=>{
          console.log("ERROR:", error);
          throw error
       })

       app.listen(process.env.PORT, ()=>{
          console.log(`Listening at ${process.env.PORT}`)
       })
     }
     catch(error){
          console.log("ERROR:",error)
          throw err
     }
})()
     */



