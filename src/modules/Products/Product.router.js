import {Router} from "express"
import * as ControllerCProduct from "./Product.controller.js"

const router = Router()

router.get("/", ControllerCProduct.getProducts)

export default router