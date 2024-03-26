import express from "express"
import { handleCreateNewProduct, handleDeleteProduct, handleFindAllProduct, handleFindOneProduct, handleAllProductsOfOneUser } from "../controllers/product.controller.js";
import { upload } from "../utils/multer.js";

const router = express.Router()

router.post("/new", upload.array("images",10), handleCreateNewProduct)
router.post("/delete/:id", handleDeleteProduct)
router.post("/findone/:id", handleFindOneProduct)
router.get("/all", handleFindAllProduct)
router.get("/alloneuser", handleAllProductsOfOneUser)

export default router;