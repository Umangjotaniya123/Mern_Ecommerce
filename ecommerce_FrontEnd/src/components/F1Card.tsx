import React, { useEffect, useState } from 'react'
import { Address, User } from '../types/types';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { useUpdateUserMutation } from '../redux/api/userAPI';
import toast from 'react-hot-toast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { MessageResponse } from '../types/api-types';

interface ParamsType {
  addressInfo: Address[];
  setAddressInfo: React.Dispatch<React.SetStateAction<Address[]>>;
  id: string;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<User>>;
}

const initialValue:Address[] = [{
  address: '',
  city: '',
  state: '',
  country: '',
  pincode: undefined,
  addType: '',
}];

const options = ["Home", "Work", "Other"];

const FormCard = ({ addressInfo, setAddressInfo, id, errors, setErrors }: ParamsType) => {

  const [show, setShow] = useState<boolean[]>(addressInfo.map(() => false));
  // console.log(addressInfo, show);
  const [newAdd, setNewAdd] = useState(true);
  const [userUpdate] = useUpdateUserMutation();

  useEffect(() => {
    if (JSON.stringify(initialValue) === JSON.stringify(addressInfo))
    {
      setNewAdd(false);
      console.log(addressInfo);
    }
  });

  const handleChange = (e: any, index: number) => {
    const updatedAddressInfo = addressInfo.map((item, idx) =>
      idx === index ? { ...item, [e.target.name]: e.target.value } : item
    );
    setAddressInfo(updatedAddressInfo);
  }

  const toggleVisibility = (index: number) => {
    setShow((prevShow) =>
      prevShow.map((isVisible, idx) => (idx === index ? !isVisible : isVisible))
    );
  };

  const handleDelete = async (index: number) => {

    if (!newAdd) {
      const updateAdd = addressInfo.filter((_, id) => id !== index);
      setAddressInfo(updateAdd);
      const updateErr = errors.filter((_: Address, id: number) => id !== index);
      setErrors((pre) => ({
        ...pre,
        "addressInfo": updateErr
      }))
    }
    else {


      const formData = new FormData();
      formData.set("index", index.toString());

      const res = await userUpdate({ formData, userId: id });
      if ("data" in res) {
        const updateAdd = addressInfo.filter((_, id) => id !== index);
        setAddressInfo(updateAdd);
        const updateErr = errors.filter((_: Address, id: number) => id !== index);
        setErrors((pre) => ({
          ...pre,
          "addressInfo": updateErr
        }))
        toast.success("Address Deleted Successfully");
      }
      else {
        const error = res.error as FetchBaseQueryError;
        const messageResponse = error.data as MessageResponse;
        toast.error(messageResponse.message);
        console.log(messageResponse.message);
      }
    }
  }
  return (
    <>
      {addressInfo && addressInfo?.map(({ address, city, state, country, pincode, addType }, index: number) => (

        <div key={index}>
          <div className="show">
            {newAdd ? <>
              <p>{addType} Address</p>
              <div className="plus" onClick={() => toggleVisibility(index)}>
                {show[index] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </> : <>
              <p>New Address</p>
            </>
            }
            <div className='delete' onClick={() => handleDelete(index)}><FaTrash /></div>
          </div>
          {(show[index] || !newAdd) && <div className="box" >
            <div className="input">
              <label htmlFor="">Type of address</label>
              <select
                name='addType'
                value={addType}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">Type of address</option>
                {/* <option value="Home">Home</option>
                  <option value="Work">Work</option> */}
                {options.map((option, index) => {
                  return <option value={option} key={index}>{option}</option>
                })}
              </select>
              {errors?.[index]?.addType && <small>Select the Type of Address</small>}
            </div>
            <div className="input">
              <label htmlFor="">Landmark</label>
              <input type="text"
                name='address'
                placeholder="Landmark"
                value={address}
                onChange={(e) => handleChange(e, index)}
              />
              {errors?.[index]?.address && <small>Feild is required</small>}
            </div>
            <div className="input">
              <label htmlFor="">City</label>
              <input type="text"
                name='city'
                placeholder="City"
                value={city}
                onChange={(e) => handleChange(e, index)}
              />
              {errors?.[index]?.city && <small>Feild is required</small>}
            </div>
            <div className="input">
              <label htmlFor="">State</label>
              <input type="text"
                name='state'
                placeholder="State"
                value={state}
                onChange={(e) => handleChange(e, index)}
              />
              {errors?.[index]?.state && <small>Feild is required</small>}
            </div>
            <div className="input">
              <label htmlFor="">Country</label>
              <select
                name='country'
                value={country}
                onChange={(e) => handleChange(e, index)}
              >
                <option value="">Choose Country</option>
                <option value="India">India</option>
              </select>
              {errors?.[index]?.country && <small>Feild is required</small>}
            </div>
            <div className="input">
              <label htmlFor="">Pin code</label>
              <input type="number"
                name='pincode'
                placeholder="Pin code"
                value={pincode}
                onChange={(e) => handleChange(e, index)}
              />
              {errors?.[index]?.pincode && <small>Feild is required & Enterd 6 degits code</small>}
            </div>
            <br />
          </div>
          }
        </div>
      ))}
    </>
  )
};

export default FormCard;