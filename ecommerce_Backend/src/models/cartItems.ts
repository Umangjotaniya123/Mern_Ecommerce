import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add Name"],
    },
    photo: {
        type: String,
        required: [true, "Please add Photo"],
    },
    price: {
        type: Number,
        required: [true, "Please add Price"],
    },
    quantity: {
        type: Number,
        required: [true, "Please add Quantity"],
    },
    stock: {
        type: Number,
        required: [true, "Please add Stock"],
    },
    productId: {
        type: String,
        required: [true, 'Please add ProductId']
    },
    userId: {
        type: String,
        required: [true, 'Please add userId']
    }
}, {
    timestamps: true,
});

export const CartItems = mongoose.model("CartItems", schema);