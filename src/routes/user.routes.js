import {Router} from "express";
import { logoutUser, registerUser, userlogin } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.miidleware.js";
const router = Router()


router.route("/register").post(
     upload.fields([
          {
               name:"avatar",
               maxCount:1
          },
          {
            name:"coverImage",
            maxCount: 1
          }
     ]),
     registerUser);

router.route("/login").post(userlogin);

// secured routes 

router.route("/logout").post(verifyToken, logoutUser)





// export default router        this is variable export so we can import it using any name 
export {router}                 // this is named export we have to import it using {} 
