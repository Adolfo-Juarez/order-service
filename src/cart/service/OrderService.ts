import Cart from '../models/Cart.ts';
import Product from '../models/Product.ts';

interface OrderDetails {
    total: number;
    articles: Article[]
}

interface Article {
    name: string;
    units: number;
    unit_price: number;
    total: number
}

interface OrderResume {
    success: boolean;
    resume: OrderDetails
}

interface PaymentDetails {
    user_id: number;
    card_number: number;
    card_name: string;
    cvc: number;

}

export async function getOrderDetailsService(userId: number): Promise<OrderDetails> {
    // Get all cart items for the specified userId
    const cartItems = await Cart.findAll({
        where: { userId }
    });

    // Initialize the order details
    const orderDetails: OrderDetails = {
        total: 0,
        articles: []
    };
    
    // If no cart items found, return empty order details
    if (cartItems.length === 0) {
        return orderDetails;
    }
    
    // For each cart item, get the product details and build the article
    for (const cartItem of cartItems) {
        const product = await Product.findByPk(cartItem.dataValues.productId);
        
        if (product) {
            // Calculate the total for this article
            const articleTotal = Number(product.dataValues.price) * cartItem.dataValues.quantity;
            
            // Add article to the list
            orderDetails.articles.push({
                name: product.dataValues.name,
                units: cartItem.dataValues.quantity,
                unit_price: Number(product.dataValues.price),
                total: articleTotal
            });
            
            // Add to the overall total
            orderDetails.total += articleTotal;
        }
    }
    
    return orderDetails;
}

export async function payCurrentOrderService(payment: PaymentDetails): Promise<OrderResume> {
    // Get the order details for the user
    const orderDetails = await getOrderDetailsService(payment.user_id);
    
    // If there are no items in the cart, return unsuccessful order
    if (orderDetails.articles.length === 0) {
        return {
            success: false,
            resume: orderDetails
        };
    }
    
    // Get all cart items for the user
    const cartItems = await Cart.findAll({
        where: { userId: payment.user_id }
    });
    
    // Process each cart item
    for (const cartItem of cartItems) {
        // Get the product
        const product = await Product.findByPk(cartItem.dataValues.productId);
        
        if (product) {
            // Calculate new stock after purchase
            const newStock = product.dataValues.stock - cartItem.dataValues.quantity;
            
            if (newStock <= 0) {
                // If stock becomes zero or negative, delete the product
                await product.destroy();
            } else {
                // Otherwise update the stock
                await product.update({ stock: newStock });
            }
            
            // Remove the item from cart after processing
            await cartItem.destroy();
        }
    }
    
    // Return successful order with details
    return {
        success: true,
        resume: orderDetails
    };
}