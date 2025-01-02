import React, { useState } from 'react'
import { User } from '../types/types';
import { FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { useFormContext } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';

const options = ["Home", "Work", "Other"];
const initialValue = {
  address: '',
  city: '',
  state: '',
  country: '',
  pincode: undefined,
  addType: '',
};

const AddressList = ({ fieldsArray }: any) => {

  const { register, formState: { errors } } = useFormContext<User>();
  const { fields, append, remove } = fieldsArray;
  const [show, setShow] = useState<boolean[]>(fields.map(() => false));

  const toggleVisibility = (index: number) => {
    setShow((prevShow) =>
      prevShow.map((isVisible, idx) => (idx === index ? !isVisible : isVisible))
    );
  };

  return (
    <>
      {fields.map((field: { id: React.Key | null | undefined; addType: string }, _index: any) => (
        <div key={field.id}>
          {/*  */}
          <div className="show">
            <p>{field?.addType ? field.addType : 'New'} Address</p>
            <div className="plus" onClick={() => toggleVisibility(_index)}>
              {show[_index] ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            <div className='delete' onClick={() => remove(_index)}><FaTrash /></div>
          </div>

          {(show[_index]) && <div className='box' key={field.id}>

            {/* Address Type */}
            <div className="input">
              <label htmlFor="">Type of address</label>
              <select
                {...register(`addressInfo.${_index}.addType`, { required: 'Select type of Address' })}
              >
                <option value="">Type of address</option>
                {options.map((option, index) => {
                  return <option value={option} key={index}>{option}</option>
                })}
              </select>
              {Array.isArray(errors.addressInfo) && (errors.addressInfo as any)?.[_index]?.addType && <small>
                {(errors.addressInfo as any)?.[_index]?.addType.message}
              </small>}
            </div>

            {/* Landmark */}
            <div className="input">
              <label htmlFor="">Landmark</label>
              <input type="text"
                placeholder="Landmark"
                {...register(`addressInfo.${_index}.address`, { required: 'Landmark is required' })}
              />
              {(errors.addressInfo as any)?.[_index]?.address &&
                <small>{(errors.addressInfo as any)?.[_index]?.address.message}</small>
              }
            </div>

            {/* City */}
            <div className="input">
              <label htmlFor="">City</label>
              <input type="text"
                placeholder="City"
                {...register(`addressInfo.${_index}.city`, { required: 'City is required' })}
              />
              {(errors.addressInfo as any)?.[_index]?.city && <small>
                {(errors.addressInfo as any)?.[_index]?.city.message}
              </small>}
            </div>

            {/* State */}
            <div className="input">
              <label htmlFor="">State</label>
              <input type="text"
                placeholder="State"
                {...register(`addressInfo.${_index}.state`, { required: 'State is required' })}
              />
              {(errors.addressInfo as any)?.[_index]?.state && <small>
                {(errors.addressInfo as any)?.[_index]?.state.message}
              </small>}
            </div>

            {/* Country */}
            <div className="input">
              <label htmlFor="">Country</label>
              <select
                {...register(`addressInfo.${_index}.country`, { required: 'Select your country' })}
              >
                <option value="">Choose Country</option>
                <option value="India">India</option>
              </select>
              {(errors.addressInfo as any)?.[_index]?.country && <small>
                {(errors.addressInfo as any)?.[_index]?.country.message}
              </small>}
            </div>

            {/* Pin Code */}
            <div className="input">
              <label htmlFor="">Pincode</label>
              <input type="number"
                placeholder="Pincode"
                {...register(`addressInfo.${_index}.pincode`, {
                  required: 'Pincode is required',
                  minLength: 6, maxLength: 6,
                })}
              />
              {(errors.addressInfo as any)?.[_index]?.pincode
                && ((errors.addressInfo as any)?.[_index]?.pincode.type === 'required' ?
                  <small>{(errors.addressInfo as any)?.[_index]?.pincode.message}</small>
                  : <small>Enterd 6 degits code</small>
                )}
            </div>
          </div>}
        </div>
      ))}

      {/* Add New Address */}
      <div className="add">
        <h4>Add AdressInfo</h4>
        <p className="puls" onClick={() => (
          append(initialValue),
          setShow([...show, true])
        )}>
          <FaPlus />
        </p>
      </div>
    </>
  )
};

export default AddressList;