import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "../middlewares/error.js";
import { rm } from "fs";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = TryCatch(
    async (
        req: Request<{}, {}, NewUserRequestBody>,
        res: Response,
        next: NextFunction
    ) => {
        // const { name, email, photo, gender, _id, dob } = req.body;
        const { name, email, password, gender, dob } = req.body;

        let user = await User.findOne({ email });

        if (user)
            return res.status(400).json({
                success: false,
                message: 'User Already Exist',
            })

        if (!name || !email || !password || !gender || !dob)
            return next(new ErrorHandler("Please fill all details", 400));

        const hashPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            name, email, gender, dob, password: hashPassword,
        });

        // setCookie(user, res, `welcome, ${user.name}`, 201);
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '10d'});

        return res.status(201)
            .cookie("token", token)
            .json({
                success: true,
                message: `welcome, ${user.name}`,
            });
    }
);

export const loginUser = TryCatch(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password)
        return next(new ErrorHandler("Please fill all details", 400));

    const user = await User.findOne({ email }).select('+password');

    if (!user) return next(new ErrorHandler('Invalid Email or Password', 400));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return next(new ErrorHandler('Invalid Email or Password', 400));

    // sendCookie(user, res, `Welcom back, ${user.name}`, 200);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "10d" });

    res.cookie("token", token);
    return res.status(201)
        .json({
            success: true,
            message: `welcome back, ${user.name}`,
        });
});

export const logoutUser = TryCatch(async (req, res, next) => {

    return res.status(201)
        .cookie('token', '', { expires: new Date(Date.now())})
        .json({
            success: true,
            message: `User Logged out`,
        });
})

export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});

    res.status(200).json({
        success: true,
        users,
    });
});

export const getUsers = TryCatch(async (req, res, next) => {

    const id = req.params.id;
    console.log(id);
    const user = await User.findById(id);

    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));

    res.status(200).json({
        success: true,
        user,
    });
});

export const deleteUser = TryCatch(async (req, res, next) => {

    const id = req.params.id;
    const user = await User.findById(id);
    console.log(user, id);
    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});

export const updateUser = TryCatch(async (req, res, next) => {

    const { name, email, gender, dob, addressInfo, index } = req.body;
    const id = req.params.id;
    const photo = req.file;
    const seq: Number = index;
    let b = 0;

    const user = await User.findById(id);
    // console.log('add', addressInfo);

    if (!user)
        return next(new ErrorHandler("Invalid Id", 400));

    if (photo) {
        if(user.photo) rm(user.photo, () => {
            console.log('Old Photo Deleted');
        })
        user.photo = photo.path;
        b = 1;
    }


    if ((!name || !gender || !email || !dob))
        return next(new ErrorHandler("Please fill all details", 400));

    if (name && validation({ user, key: "name", value: name })) {
        user.name = name;
        b = 1;
    }

    if (email && validation({ user, key: 'email', value: email })) {
        user.email = email;
        b = 1;
    }

    if (gender && validation({ user, key: 'gender', value: gender })) {
        user.gender = gender;
        b = 1;
    }

    if (dob && validation({ user, key: 'dob', value: dob })) {
        user.dob = dob;
        b = 1;
    }

    if (
        addressInfo &&
        validation({ user, key: 'addressInfo', value: addressInfo })
    ) {
        user.addressInfo = JSON.parse(addressInfo);
        b = 1;
    }

    // console.log(user.addressInfo);

    if (seq) {
        const add = user.addressInfo.filter((_, index) => index != seq)
        user.addressInfo = add;
        b = 1;
    }

    // console.log('new -', user.addressInfo);

    if (b == 1) await user.save();

    res.status(200).json({
        success: true,
        message: b == 1 ? `User Updated Successfully` : 'No Changes',
    });
})

interface ValidationProps {
    user: InstanceType<typeof User>;
    key: keyof InstanceType<typeof User>;
    value: any
}

const validation = ({ user, key, value }: ValidationProps): boolean => {

    if (key == 'addressInfo' && JSON.stringify(user[key]) === value) {
        return false;
    }

    if (key == 'dob' && user[key].toISOString().split('T')[0] === value)
        return false;

    return user[key] !== value;
}