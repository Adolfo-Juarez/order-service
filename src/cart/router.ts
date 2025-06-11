import express from "express";
import ValidateAdminUserMiddleware from "../middleware/ValidateAdminUserMiddleware.ts";
import {getOrderDetailController, payCurrentOrderController} from "./controller/OrderController.ts"

const router = express.Router();

router.get('/', ValidateAdminUserMiddleware, getOrderDetailController);
router.post('/', ValidateAdminUserMiddleware, payCurrentOrderController);

export default router;