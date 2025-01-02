import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type CartItemProps = {
  cartItem: CartItem;
  incrementHandler: (_id:string, cartItem: CartItem) => void;
  decrementHandler: (_id:string, cartItem: CartItem) => void;
  removeHandler: (id: string, productId: string) => void;
}

const CartItems = ({ cartItem, incrementHandler, decrementHandler, removeHandler }: CartItemProps) => {

  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>
      <div>
        <button disabled={quantity == 1} onClick={() => decrementHandler(cartItem?._id || '', cartItem)} >-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem?._id || '', cartItem)} >+</button>
      </div>
      <button onClick={() => removeHandler(cartItem?._id || '', productId)}><FaTrash /></button>
    </div>
  )
}
export default CartItems;