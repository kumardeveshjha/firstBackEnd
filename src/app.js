import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();

// app.use(cors())
app.use(cors(       // here we are setting up the protection of the we using cors which allow some specific url to send requests 
     {         
     origin: process.env.CORS_ORIGIN,
     credentials:true
}
))


app.use(express.json({limit:"20kb"}))   // this is for costom data limit
// when data comes from url 
app.use(express.urlencoded({extended:true,limit:"20kb"}));
// static to store the public file store
app.use(express.static("public"));
app.use(cookieParser())


export default app;