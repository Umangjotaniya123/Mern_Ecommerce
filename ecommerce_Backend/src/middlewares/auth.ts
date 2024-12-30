import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import jwt from 'jsonwebtoken';

export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;

    if (!id)
        return next(new ErrorHandler("Please Login First!!!", 401));

    const user = await User.findById(id);
    // console.log(id, user);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 401));

    if (user.role !== 'admin')
        return next(new ErrorHandler("Sorry, you are not admin!", 401));

    next();
});

export const verifyToken = TryCatch(async (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token)
        return res.json({})

    const { _id }: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const user = await User.findById(_id);

    if (!user)
        return next(new ErrorHandler('User Not Found', 401));

    return res.json({ user });
})