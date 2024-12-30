import { useState } from "react";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types/types";
import { useLogoutUserMutation } from "../redux/api/userAPI";
import { responseToast } from "../utils/features";

interface PropsType {
    user: User | null;
}

const Header = ({ user }: PropsType) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const [logoutUser] = useLogoutUserMutation();

    const logoutHandler = async () => {

        const res = await logoutUser();
        setIsOpen(!isOpen);
        responseToast(res, navigate, '/');
    }

    return (
        <nav className="header">
            <Link onClick={() => setIsOpen(false)} to={'/'}>Home</Link>
            <Link onClick={() => setIsOpen(false)} to={'/search'}>
                <FaSearch />
            </Link>
            <Link onClick={() => setIsOpen(false)} to={'/cart'}>
                <FaShoppingBag />
            </Link>
            {
                user?._id ? (
                    <>
                        <button onClick={() => setIsOpen((prev) => !prev)}>
                            <FaUser />
                        </button>
                        <dialog open={isOpen}>
                            <div>
                                {user.role === 'admin' && (
                                    <Link onClick={() => setIsOpen(false)} to='/admin/dashboard'>Admin</Link>
                                )}
                                <Link onClick={() => setIsOpen(false)} to="/orders">Orders</Link>
                                <Link onClick={() => setIsOpen(false)} to='/profile'>Profile</Link>
                                <button onClick={logoutHandler}><FaSignOutAlt /></button>
                            </div>
                        </dialog>
                    </>
                ) : (
                    <Link to={'/login'}>
                        <FaSignInAlt />
                    </Link>
                )
            }
        </nav>
    )
}

export default Header;