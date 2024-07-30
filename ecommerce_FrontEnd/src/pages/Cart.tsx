import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-Item";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "ndhfbbvjdf",
    photo: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba15-m3-spacegray-gallery1-202402?wid=4000&hei=3074&fmt=jpeg&qlt=90&.v=1707262825030",
    name: "MacBook",
    price: 30000,
    quantity: 4,
    stock: 10,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 300;
const discount = 200;
const total = subtotal + tax + shippingCharges;

const Cart = () => {

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if(Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    });

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    }
  }, [couponCode])

  return (
    <div className="cart">
      <main>
        {cartItems.map((i, idx) => (
          <CartItem key={idx}  cartItem={i}/>
        ))}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>tax: ₹{tax}</p>
        <p>Discount: <em> - ₹{discount}</em></p>
        <p><b>Total: ₹{total}</b></p>
        <input 
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode && (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">Invalid Coupon <VscError /></span>
        ))}
        {cartItems.length > 0 && <Link to='/shipping'>Checkout</Link>}
      </aside>
    </div>
  )
}

export default Cart;