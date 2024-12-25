import { SerializedError } from "@reduxjs/toolkit";
import { MessageResponse } from "../types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";
import { Address } from "../types/types";


type ResType = {
    data: MessageResponse;
} | {
    error: FetchBaseQueryError | SerializedError;
};

export const responseToast = 
( res: ResType, navigate: NavigateFunction, url: string) => {
    if("data" in res) {
        toast.success(res.data.message);
        if(navigate) navigate(url);
    }
    else {
        const error = res.error as FetchBaseQueryError;
        const messageResponse = error.data as MessageResponse;
        toast.error(messageResponse.message);
        console.log(messageResponse.message);
    }
};

interface ParamsType {
  name: string;
  email: string;
  gender: string;
  dob: string;
  addressInfo:Address[];
  // errors: any;
}

export const errorArray = (length: number) => {
  const newArr = Array.from({length: length}, () => ({
    address: false,
    city: false,
    state: false,
    country: false,
    pincode: false,
    addType: false,
  }))
  return newArr;
}

export const validateForm = ({name, email, gender, dob, addressInfo} : ParamsType) => {
    let newErrors: any = {};
    let b = 0;
    // console.log(addressInfo); 
    // console.log(errors); 

    if (!name.trim()) {newErrors.name = "Name is required"; b = 1;};
    if (!email.trim()) {newErrors.email = "Email is required"; b = 1};
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
      newErrors.email = "Invalid email format";
      b = 1;
    }
    if (!gender) {newErrors.gender = "Gender is required"; b = 1};
    if (!dob) {newErrors.dob = "Date of birth is required"; b = 1};

    const combineAdd = addressInfo;
    const newArr = errorArray(combineAdd.length);

    combineAdd.map((add, index) => {
      if(!add.addType) {newArr[index].addType = true; b = 1}
      if(!add.address) {newArr[index].address = true; b = 1}
      if(!add.city) {newArr[index].city = true; b = 1}
      if(!add.state) {newArr[index].state = true; b = 1}
      if(!add.country) {newArr[index].country = true; b = 1}
      if(!add.pincode 
        || (add.pincode).toString().length != 6 
        || isNaN(add.pincode)
      ) {newArr[index].pincode = true; b = 1}
    })

    newErrors = {...newErrors, "addressInfo" : newArr};
    // console.log(newErrors);
    // setErrors(newErrors);
    return b === 1 ? newErrors : 0;
  };

export const getLastMonths = () => {
    const currentDate = moment();
  
    currentDate.date(1);
  
    const last6Months: string[] = [];
    const last12Months: string[] = [];
  
    for (let i = 0; i < 6; i++) {
      const monthDate = currentDate.clone().subtract(i, "months");
      const monthName = monthDate.format("MMMM");
      last6Months.unshift(monthName);
    }
  
    for (let i = 0; i < 12; i++) {
      const monthDate = currentDate.clone().subtract(i, "months");
      const monthName = monthDate.format("MMMM");
      last12Months.unshift(monthName);
    }
  
    return {
      last12Months,
      last6Months,
    };
  };