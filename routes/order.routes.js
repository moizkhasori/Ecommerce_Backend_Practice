import express from "express"
import { handleCreateNewOrder, handleDeleteSignleOrder, handleGetSignleOrder, handleUpdateOrderStatus } from "../controllers/order.controller.js"
import { restrictToLoggedInUserOnly } from "../middlewares/RestrictToLoggedInUserOnly.js"

const router = express.Router()

router.post("/new",restrictToLoggedInUserOnly, handleCreateNewOrder)
router.post("/updatestatus/:id",restrictToLoggedInUserOnly, handleUpdateOrderStatus)

router
    .route("/:id")
    .get(restrictToLoggedInUserOnly, handleGetSignleOrder)
    .delete(restrictToLoggedInUserOnly, handleDeleteSignleOrder)

export default router