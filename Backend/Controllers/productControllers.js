import asyncHandle from "express-async-handler";
import Product from "../models/productModel.js" 

const getProducts=asyncHandle(async(req,res)=>{
   const pageSize=9
   const page=Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name:{
            $regex : req.query.keyword,
            $options : "i"
        }
    }:{}

    const count=await Product.countDocuments({...keyword})
    const products=await Product.find({...keyword}).limit(pageSize).skip(pageSize*(page -1))
    res.json({products, page, pages:Math.ceil(count / pageSize)})
    
})

const getProductById=asyncHandle(async(req,res)=>{
    const product= await Product.findById(req.params.id)
    if (product){
        
        res.json(product)
    }
    else{
        res.status(404) 
        throw new Error("product Not Found")
    }
    res.json(product);
})


const deleteProduct=asyncHandle(async(req,res)=>{
    const product= await Product.findById(req.params.id)
    if (product){
        await product.remove()
        res.send({message:"Product deleted successfully"})
    }
    else{
        res.status(404) 
        throw new Error("product Not Found")
    }
})


const createProduct=asyncHandle(async(req,res)=>{
    const product = new Product({
        name:"Sample Name",
        price:0,
        user:req.user._id,
        image:"/Images/sample.png",
        brand:"Sample brand",
        category:"Sample category",
        countInStock:0,
        numReviews:0,
        description:"Sample description"
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})


const updateProduct=asyncHandle(async(req,res)=>{
    
    const {name,price,image,brand,category,countInStock,description}=req.body
    const product = await Product.findById(req.params.id)

    if (product) {
        product.name=name
        product.price=price
        product.description=description
        product.image=image
        product.brand=brand
        product.category=category
        product.countInStock=countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
    }
    else{
        res.status(404)
        throw new Error("product Not Found")
    }

})

const createProductReview = asyncHandle(async(req,res)=>{
    
    const {rating,comment} = req.body
    const product = await Product.findById(req.params.id)

    if (Product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString () === req.user._id.toString()
        )
        if(alreadyReviewed){
            res.status(400)
            throw new Error("product already reviewed")
        }    
    

    const review={

        name:req.user.name,
        rating:Number(rating),
        comment,
        user:req.user._id,

    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
    
    product.reviews.reduce((acc,item)=>item.rating + acc,0) / 
    product.reviews.length

    await product.save()

    res.status(201).json({message:"review added"})
    
    }

    else{
        res.status(404)
        throw new Error("product not Found")
    }
    
})

const getTopProducts = asyncHandle(async (req, res) => {
const products = await Product.find({}).sort({rating: -1}).limit(3)

res.json(products)
})

export {getProductById,getProducts,deleteProduct,createProduct,updateProduct,createProductReview,getTopProducts}

