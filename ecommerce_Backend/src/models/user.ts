import mongoose from "mongoose";
import validator from "validator";

interface Address{
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: number | undefined;
    addType: string;
}
// Typescript Model
export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    photo: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    addressInfo: Address[];
    createdAt: Date;
    updatedAt: Date;
    // Virtual Attribute...
    age: number;
}

const schema = new mongoose.Schema({
    // _id: {
    //     type: String,
    //     // required: [true, "Please enter ID"],
    // },
    name: {
        type: String,
        required: [true, "Please add Name"],
    },
    email: {
        type: String,
        unique: [true, "Email already Exist"],
        required: [true, "Please enter Email"],
        validate: validator.default.isEmail,
    },
    password: {
        type: String,
        required: [true, 'Please enter Password'],
        select: false,
    },
    photo: {
        type: String,
        // required: [true, "Please add ID"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please enter Gender"],
    },
    dob: {
        type: Date,
        required: [true, "Please enter Date of birth"],
    },
    addressInfo: [{
        address: String,
        city: String,
        state: String,
        country: String,
        pincode: Number,
        addType : String,
    }],
}, {
    timestamps: true,
});

schema.virtual("age").get(function() {
    const today = new Date();
    const dob = this.dob;
    // console.log(dob);
    let age = today.getFullYear() - dob.getFullYear();

    if(today.getMonth() < dob.getMonth() || 
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) age--;

    return age;
})

export const User = mongoose.model<IUser>("User", schema);