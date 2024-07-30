import mongoose from "mongoose";
import { trim } from "validator";

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
    stock: {
        type: Number,
        required: [true, "Please add Stock"],
    },
    category: {
        type: String,
        required: [true, "Please add Category"],
        trim: true,
    },
}, {
    timestamps: true,
});

export const Product = mongoose.model("Product", schema);