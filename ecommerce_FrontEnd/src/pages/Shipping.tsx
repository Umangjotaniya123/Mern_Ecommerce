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

interface PropsType {
    addressInfo: Address;
    userId: string;
};

const Shipping = ({ addressInfo, userId }: PropsType) => {

    const { cartItems, total } = useSelector(
        (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState({
        address: addressInfo.address || '',
        city: addressInfo.city || "",
        state: addressInfo.state || "",
        country: addressInfo.country || "",
        pinCode: addressInfo.pincode,
    });

    const changehandler = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
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

    useEffect(() => {
        if (cartItems.length <= 0) return navigate("/cart");
    }, [cartItems]);

    return (
        <div className="shipping">
            <button className="back-btn" onClick={() => navigate("/cart")}><BiArrowBack /></button>
            <form onSubmit={submitHandler}>
                <h1>Shipping Address</h1>
                {/* <input
                    required
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={changehandler}
                />
                <input
                    required
                    type="text"
                    placeholder="City"
                    name="city"
                    value={shippingInfo.city}
                    onChange={changehandler}
                />
                <input
                    required
                    type="text"
                    placeholder="State"
                    name="state"
                    value={shippingInfo.state}
                    onChange={changehandler}
                />
                <select
                    required
                    name="country"
                    value={shippingInfo.country}
                    onChange={changehandler}
                >
                    <option value="">Choose Country</option>
                    <option value="India">India</option>
                </select>
                <input
                    required
                    type="text"
                    placeholder="Pin Code"
                    name="pinCode"
                    value={shippingInfo.pinCode}
                    onChange={changehandler}
                /> */}
                <div className="input">
                    <label htmlFor="">Address</label>
                    <input type="text"
                        placeholder="Address"
                        value={shippingInfo.address}
                        onChange={changehandler}
                    />
                </div>
                <div className="input">
                    <label htmlFor="">City</label>
                    <input type="text"
                        placeholder="City"
                        value={shippingInfo.city}
                        onChange={changehandler}
                    />
                </div>
                <div className="input">
                    <label htmlFor="">State</label>
                    <input type="text"
                        placeholder="State"
                        value={shippingInfo.state}
                        onChange={changehandler}
                    />
                </div>
                <div className="input">
                    <label htmlFor="">Country</label>
                    <select
                        value={shippingInfo.country}
                        onChange={changehandler}
                    >
                        <option value="">Choose Country</option>
                        <option value="India">India</option>
                    </select>
                </div>
                <div className="input">
                    <label htmlFor="">Pin code</label>
                    <input type="number"
                        placeholder="Pin code"
                        value={shippingInfo.pinCode}
                        onChange={changehandler}
                    />
                </div>
                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
}

export default Shipping;