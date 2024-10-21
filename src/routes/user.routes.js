import {Router} from "express";
import { logoutUser, registerUser, userlogin, refreshAceessToken, getCurrentUser, updateAcoountInfo, updateCoverImage} from "../controllers/user.controller.js";
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

router.route("/logout").post(verifyToken, logoutUser);

// access token 
router.route("/refresh-token").post(refreshAceessToken);

// current user rote

router. route("/current-User").post(getCurrentUser)

// updated user info 

router.route("/updated-account").post(updateAcoountInfo);

// coverImage update 

router.route("/updateCoverImage").post(updateCoverImage);






// export default router        this is variable export so we can import it using any name 
export {router}                 // this is named export we have to import it using {} 
