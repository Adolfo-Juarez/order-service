import { ModelNotFound } from "../../exception/ModelNotFound.ts";
import { OutOfRangeException } from "../../exception/OutOfRangeException.ts";
import { getOrderDetailsService, payCurrentOrderService } from "../service/OrderService.ts";

export async function getOrderDetailController(req, res) {
    try {
        // Validar que los datos necesarios estén presentes
        if (!req.body.userId) {
            return res.status(400).json({ message: 'Missing required fields: productId, quantity, userId' });
        }

        const response = await getOrderDetailsService(req.body.userId)
        return res.status(200).json(response);
    } catch (e: unknown) {
        if (e instanceof OutOfRangeException) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof ModelNotFound) {
            return res.status(404).json({ message: e.message });
        }
        console.error(e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function payCurrentOrderController(req,res) {
    try {
        // Validar que los datos necesarios estén presentes
        if (!req.body.userId || !req.body.card_number || !req.body.card_name || !req.body.cvc) {
            return res.status(400).json({ message: 'Missing required fields: cvc, card_number, card_name' });
        }

        const response = await payCurrentOrderService({
            user_id: req.body.userId,
            card_number: req.body.card_number,
            card_name: req.body.card_name,
            cvc: req.body.cvc
        })
        return res.status(200).json(response);
    } catch (e: unknown) {
        if (e instanceof OutOfRangeException) {
            return res.status(400).json({ message: e.message });
        }
        if (e instanceof ModelNotFound) {
            return res.status(404).json({ message: e.message });
        }
        console.error(e);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}