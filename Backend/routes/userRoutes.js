import  express  from "express";

const router= express.Router()

import {authUsers,getUserProfile,registerUser,updateUserProfile,getUser,deleteUser,getUserById,updateUser} from "../Controllers/userControllers.js"

import {protect,admin} from "../middleware/authMiddleware.js"

router.post("/login", authUsers)
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile)
router.route("/").post(registerUser).get(protect,admin,getUser)
router.route("/:id").delete(protect,admin,deleteUser).get(protect,admin,getUserById).put(protect,admin,updateUser)

export default router