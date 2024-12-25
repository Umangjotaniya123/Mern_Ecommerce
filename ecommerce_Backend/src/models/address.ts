import mongoose from "mongoose";

const schema = new mongoose.Schema({

    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
        enum: ["India"],
    },
    pincode: {
        type: Number,
    },
    userId: {
        type: String,
        ref: "User",
        required: true,
    }
});

export const Address = mongoose.model("Address", schema);