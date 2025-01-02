import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { RootState, server } from "../redux/store";
import { Address } from "../types/types";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const initialAddress = {
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: null!,
    addType: "",
};

const Shipping = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);
    const { cartItems, total } = useSelector((state: RootState) => state.cartReducer);

    const addressInfo: Address[] | undefined = user?.addressInfo;
    const [shippingInfo, setShippingInfo] = useState<Address>(initialAddress);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Address>({ defaultValues: initialAddress });

    useEffect(() => {
        if (addressInfo && addressInfo.length > 0) {
            // Set the first address as default
            setShippingInfo(addressInfo[0]);
            setSelectedAddressIndex(0);
            Object.entries(addressInfo[0]).forEach(([key, value]) =>
                setValue(key as keyof Address, value)
            );
        } else {
            // Reset to an empty form for new address
            reset(initialAddress);
        }
    }, [addressInfo, reset, setValue]);

    useEffect(() => {
        if (cartItems.length <= 0) return navigate("/cart");
    }, [cartItems]);

    const handleSelect = (index: number) => {
        reset(initialAddress);
        setSelectedAddressIndex(index);
        if (addressInfo && addressInfo[index]) {
            const selectedAddress = addressInfo[index];
            setShippingInfo(selectedAddress);
            Object.entries(selectedAddress).forEach(([key, value]) =>
                setValue(key as keyof Address, value)
            );
        }
    };

    const handleNewAddress = () => {
        setSelectedAddressIndex(-1);
        setShippingInfo(initialAddress);
        reset(initialAddress);
        // setValue("pincode", null);
    };

    const onSubmit = async (data: Address) => {
        
        dispatch(saveShippingInfo(data));
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

    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}>
                <BiArrowBack />
            </button>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h5>Select Shipping Address</h5>
                {addressInfo &&
                    addressInfo.map((address, index) => (
                        <div key={index} className="address">
                            <input
                                type="radio"
                                name="select"
                                checked={selectedAddressIndex === index}
                                onChange={() => handleSelect(index)}
                            />
                            <label>
                                <p><span>{`${address.addType} Address: `}</span>
                                {`${address.address}, ${address.city}, ${address.state}, ${address.country}.`}</p>
                                <p><span>Pincode: </span>{address.pincode}</p>
                            </label>
                        </div>
                    ))}
                <button type="button" onClick={handleNewAddress}>
                    Add New Address
                </button>

                <h1>{selectedAddressIndex === -1 ? "New Address" : "Edit Address"}</h1>
                <div className="form-fields">
                    <div className="input">
                        <label>Landmark</label>
                        <input
                            placeholder="Landmark"
                            {...register("address", { required: "Landmark is required" })}
                        />
                        {errors.address && <small className="error">{errors.address.message}</small>}
                    </div>
                    <div className="input">
                        <label>City</label>
                        <input
                            placeholder="City"
                            {...register("city", { required: "City is required" })}
                        />
                        {errors.city && <small className="error">{errors.city.message}</small>}
                    </div>
                    <div className="input">
                        <label>State</label>
                        <input
                            placeholder="State"
                            {...register("state", { required: "State is required" })}
                        />
                        {errors.state && <small className="error">{errors.state.message}</small>}
                    </div>
                    <div className="input">
                        <label>Country</label>
                        <select {...register("country", { required: "Country is required" })}>
                            <option value="">Choose Country</option>
                            <option value="India">India</option>
                        </select>
                        {errors.country && <small className="error">{errors.country.message}</small>}
                    </div>
                    <div className="input">
                        <label>Pincode</label>
                        <input
                            type="number"
                            placeholder="Pincode"
                            {...register("pincode", {
                                required: "Pincode is required",
                                minLength: { value: 6, message: "Pincode must be 6 digits" },
                                maxLength: { value: 6, message: "Pincode must be 6 digits" },
                            })}
                        />
                        {errors.pincode && <small className="error">{errors.pincode.message}</small>}
                    </div>
                </div>
                <button type="submit">Proceed to Pay</button>
            </form>
        </div>
    );
};

export default Shipping;
