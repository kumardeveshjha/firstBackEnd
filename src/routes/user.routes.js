import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()


router.route("/register").post(
     upload.fields([
          {
               name:"avatar",
               maxCount:1
               
          },
          {
            name:"coverFile",
            maxCount: 1
          }
     ]),
     registerUser);



// export default router        this is variable export so we can import it using any name 
export {router}                 // this is named export we have to import it using {} 
