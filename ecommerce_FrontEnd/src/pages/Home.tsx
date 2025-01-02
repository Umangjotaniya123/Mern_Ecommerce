import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { CartItem, User } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { useNewCartItemMutation } from "../redux/api/cartItems";
import { responseToast } from "../utils/features";
import { RootState } from "../redux/store";

const Home = () => {

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  )

  const { data, isLoading, isError } = useLatestProductsQuery("");
  const [newCartItem] = useNewCartItemMutation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const addToCartHandler = async(cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    const res = await newCartItem(cartItem);

    // console.log(res);
    // if('data' in res)
    //   dispatch(addToCart(cartItem));
    responseToast(res, navigate, '');
    // toast.success("Added to Cart"); 
  };

  if (isError) toast.error("Cannot Fetch the Products");

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Product
        <Link to={"/search"} className="findmore">More</Link>
      </h1>
      <main>
        {isLoading ? <Skeleton width="80vw" /> :
          data?.products.map(i => (
            <ProductCard
              key={i._id}
              productId={i._id}
              userId={user?._id || ''}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        }
      </main>
    </div>
  )
}

export default Home;