import express from "express"
const router=express.Router()
import {getProductById,getProducts,deleteProduct,createProduct,updateProduct,createProductReview} from "../Controllers/productControllers.js"
import {protect,admin} from "../middleware/authMiddleware.js"
import {getTopProducts} from '../Controllers/productControllers.js'


router.route("/").get(getProducts).post(protect,admin,createProduct)
router.route("/:id/reviews").post(protect,createProductReview)
router.route('/top').get(getTopProducts)
router.route("/:id").get(getProductById).delete(protect,admin,deleteProduct).put(protect,admin,updateProduct)



export default router