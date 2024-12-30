import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer-types";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { Address } from "../types/types";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

interface PropsType {
    addressInfo: Address[] | undefined;
    // userId: string;
};

const initialAddress = {
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: undefined,
    addType: '',
};

const Shipping = ({ addressInfo }: PropsType) => {

    const { cartItems, total } = useSelector(
        (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState<Address>(initialAddress);
    const { register, handleSubmit, formState: {errors} } = useForm<Address>({
        defaultValues: shippingInfo,
    });


    const changehandler = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    };

    const submitHandle = async (e: any) => {
        e.preventDefault();

        dispatch(saveShippingInfo(shippingInfo));

        try {
            const { data } = await axios.post(
                `${server}/api/v1/payment/create`,
                { amount: total },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            navigate("/pay", {
                state: data.clientSecret,
            });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const onSubmit = (data: Address) => {
        console.log(data);
    }

    const handleSelect = (e: any, index: number) => {
        setShippingInfo(initialAddress);
        if (addressInfo && addressInfo[index]) {
            const add = addressInfo[index];
            setShippingInfo({
                address: add.address as string,
                city: add.city,
                state: add.state,
                country: add.country,
                pincode: add.pincode as number | undefined,
                addType: add.addType
            });
        }
    }

    useEffect(() => {
        if (cartItems.length <= 0) return navigate("/cart");
    }, [cartItems]);

    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}><BiArrowBack /></button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h5>Select Shipping Address</h5>
                {addressInfo && addressInfo.map(({ address, city, state, country, pincode, addType }, index) => (
                    <div className="address">
                        <input type="radio" name="select" onClick={(e) => handleSelect(e, index)} />
                        <div>
                            <div key={index}><span>{`${addType} Address --> `}</span>{`${address}, ${city}, ${state}, ${country}.`}</div>
                            <div><span>{`Pincode --> `}</span>{pincode}</div>
                        </div>
                    </div>
                ))}
                <h1>New Shipping Address</h1>
                <div className='box' >
                    {/* Landmark */}
                    <div className="input">
                        <label htmlFor="">Landmark</label>
                        <input type="text"
                            defaultValue={shippingInfo.address}
                            placeholder="Landmark"
                            {...register('address', { required: 'Landmark is required' })}
                        />
                        {/* {(errors)?.address && <small>{(errors)?.address?.message}</small>} */}
                    </div>

                    {/* City */}
                    <div className="input">
                        <label htmlFor="">City</label>
                        <input type="text"
                            defaultValue={shippingInfo.city}
                            placeholder="City"
                            {...register(`city`, { required: 'City is required' })}
                        />
                        {/* {(errors.addressInfo as any)?.[_index]?.city && <small>
                            {(errors.addressInfo as any)?.[_index]?.city.message}
                        </small>} */}
                    </div>

                    {/* State */}
                    <div className="input">
                        <label htmlFor="">State</label>
                        <input type="text"
                            defaultValue={shippingInfo.state}
                            placeholder="State"
                            {...register(`state`, { required: 'State is required' })}
                        />
                        {/* {(errors.addressInfo as any)?.[_index]?.state && <small>
                            {(errors.addressInfo as any)?.[_index]?.state.message}
                        </small>} */}
                    </div>

                    {/* Country */}
                    <div className="input">
                        <label htmlFor="">Country</label>
                        <select
                            defaultValue={shippingInfo.country}
                            {...register(`country`, { required: 'Select your country' })}
                        >
                            <option value="">Choose Country</option>
                            <option value="India">India</option>
                        </select>
                        {/* {(errors.addressInfo as any)?.[_index]?.country && <small>
                            {(errors.addressInfo as any)?.[_index]?.country.message}
                        </small>} */}
                    </div>

                    {/* Pin Code */}
                    <div className="input">
                        <label htmlFor="">Pincode</label>
                        <input type="number"
                            defaultValue={shippingInfo.pincode}
                            placeholder="Pincode"
                            {...register(`pincode`, {
                                required: 'Pincode is required',
                                minLength: 6, maxLength: 6,
                            })}
                        />
                        {/* {(errors.addressInfo as any)?.[_index]?.pincode
                            && ((errors.addressInfo as any)?.[_index]?.pincode.type === 'required' ?
                                <small>{(errors.addressInfo as any)?.[_index]?.pincode.message}</small>
                                : <small>Enterd 6 degits code</small>
                            )} */}
                    </div>
                </div>

                <button type="reset" onClick={() => setShippingInfo(initialAddress)}>Reset</button>
                <button >Pay Now</button>
            </form >
        </div >
    )
}

export default Shipping;