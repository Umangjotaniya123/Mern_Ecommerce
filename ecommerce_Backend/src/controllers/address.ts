import { TryCatch } from "../middlewares/error.js";
import { Address } from "../models/address.js";

export const newAddress = TryCatch( async(req, res, next) => {

    const { address, city, state, country, pincode, userId } = req.body; 

    const newAddress = await Address.create({
        address, city, state, country, pincode, userId
    });

    res.status(201).json({
        success: true,
        message: "Added successfully"
    });
})