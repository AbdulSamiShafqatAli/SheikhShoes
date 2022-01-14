import path from "path"

import express from "express"

import  {config}  from "dotenv"

import products from "./DataName/products.js"

import connectDB from "./config/db.js"

import productsRoutes from "./routes/productRoutes.js"

import {notFound,errorHandler} from "./middleware/errormiddleware.js"

import userRoutes from "./routes/userRoutes.js"

import colors from "colors"

import orderRoutes from "./routes/OrderRoutes.js"

import uploadRoutes from "./routes/uploadRoutes.js"

import morgan from "morgan"


const app=express()

app.use(express.json())

if (process.env.NODE_ENV==="development") {
    app.use(morgan("dev"))
}

app.use("/api/products",productsRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/upload",uploadRoutes)


const __dirname = path.resolve()
app.use("/uploads",express.static(path.join(__dirname,"/uploads")))

app.get("/api/config/paypal",(req,res)=>
res.send(process.env.PAYPAL_CLIENT_ID)
)

app.use(notFound)
app.use(errorHandler)

config()

connectDB()

const PORT=process.env.PORT||5000;
       
app.listen (PORT,()=>{
    console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
})









