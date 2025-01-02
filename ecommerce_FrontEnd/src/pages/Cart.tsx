import { useCallback, useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/cart-Item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, removeCartItem } from "../redux/reducer/cartReducer";
import { useAllCartItemsQuery, useDeleteCartItemMutation, useUpdateQuantityMutation } from "../redux/api/cartItems";
import { Skeleton } from "../components/Loader";
import { RootState } from "../redux/store";
import debounce from 'lodash/debounce'

const Cart = () => {

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  )

  const dispatch = useDispatch();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateQuantity] = useUpdateQuantityMutation();
  const { data, isLoading } = useAllCartItemsQuery(user?._id || '');
  // console.log(data);

  useEffect(() => {
    if (data?.cartItems)
      data.cartItems.map((item, index) =>
        dispatch(addToCart(item))
      )

  }, [data, dispatch])

  const { cartItems, subtotal, tax, total, shippingCharges, discount } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);


  const incrementHandler = async (_id: string, cartItem: CartItem) => {

    // if (cartItem.quantity >= cartItem.stock) {
    //   toast.error('No of Quantity not available in stock');
    //   return;
    // }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
    debouncedUpdateQuantity({ _id, quantity: cartItem.quantity + 1 });
  };

  const updateQuantityHandler = async ({ _id, quantity }: any) => {
    // console.log(quantity);
    await updateQuantity({
      id: _id,
      quantity,
    });
  };

  const debouncedUpdateQuantity = useCallback(
    debounce(updateQuantityHandler, 1000 // Debounce delay in milliseconds
  ), []);

  const decrementHandler = async (_id: string, cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
  
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
    debouncedUpdateQuantity({ _id, quantity: cartItem.quantity - 1 });
  };




  const removeHandler = async (_id: string, productId: string) => {

    const res = await deleteCartItem(_id);
    if ('data' in res)
      dispatch(removeCartItem(productId));
  };


  // useEffect(() => {

  //   const { token: cancelToken, cancel } = axios.CancelToken.source();

  //   const timeOutId = setTimeout(() => {

  //     axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, { cancelToken })
  //       .then((res) => {
  //         dispatch(discountApplied(res.data.discount))
  //         dispatch(calculatePrice());
  //         setIsValidCouponCode(true);
  //       })
  //       .catch(() => {
  //         dispatch(discountApplied(0));
  //         dispatch(calculatePrice());
  //         setIsValidCouponCode(false);
  //       });
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timeOutId);
  //     cancel();
  //     setIsValidCouponCode(false);
  //   }
  // }, [couponCode])

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {isLoading ? <Skeleton width="80vw" /> :
          cartItems.length > 0 ? (
            cartItems.map((i, idx) => (
              <CartItemCard
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
                key={idx}
                cartItem={i}
              />
            ))
          ) : (
            <>
              <h1>No Items Added</h1>
            </>
          )}
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