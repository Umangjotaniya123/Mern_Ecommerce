import { TryCatch } from "../middlewares/error.js";
import { CartItems } from "../models/cartItems.js";
import ErrorHandler from "../utils/utility-class.js";

export const newCartItems = TryCatch(async (req, res, next) => {
    const { name, photo, price, quantity, stock, productId, userId } = req.body;

    if (!name || !price || !photo || !quantity || !stock || !productId || !userId)
        return next(new ErrorHandler("Please enter all fields", 400));

    let cartItem = await CartItems.find({ 'userId': userId });

    if (cartItem && cartItem.filter(item => item.productId === productId).length) {
        return res.status(201).json({
            success: true,
            message: "Product already added to Cart",
        });
    }
    else {
        await CartItems.create({
            name, price, stock, photo, quantity, productId, userId
        });

        return res.status(201).json({
            success: true,
            message: "Product add to Cart",
        });
    }
});

export const allCartItems = TryCatch(async(req, res, next) => {
    const { id } = req.query;
    
    if(!id)
        return res.json({});

    const cartItems = await CartItems.find({ 'userId': id });

    return res.status(200).json({
        success: true,
        cartItems,
    })
});

export const deleteCartItem = TryCatch(async (req, res, next) => {
    const { id } = req.params;

    const cartItem = await CartItems.findById(id);

    if(!cartItem)
        return next(new ErrorHandler("Invalid Id", 400));

    await cartItem.deleteOne();

    res.status(200).json({
        success: true,
        message: "CartItem Deleted Successfully",
    });
})

export const updateCartItemQuantity = TryCatch(async(req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;

    console.log(quantity);
    const cartItem = await CartItems.findById(id);

    if(!cartItem)
        return next(new ErrorHandler("Invalid Id", 400));

    cartItem.quantity = quantity;

    await cartItem.save();

    return res.status(200).json({
        success: true,
        message: "Updated"
    });
})