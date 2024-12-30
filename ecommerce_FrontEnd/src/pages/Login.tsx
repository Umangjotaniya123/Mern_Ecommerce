import { useForm } from "react-hook-form";
import { User } from "../types/types";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/api/userAPI";
import { responseToast } from "../utils/features";
import { useDispatch } from "react-redux";

const Login = () => {

    const [loginUser] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm<User>({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: User) => {
        // console.log(data);

        const res = await loginUser(data);
        if (res.data) {
            dispatch({ type: "someSlice/success", payload: res.data });
        }
        else if (res.error) {
            dispatch({ type: "someSlice/error", payload: res.error });
        }

        responseToast(res, navigate, '/');
        // console.log('res-', res);
        // console.log('Cookie - ', document.cookie);
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="heading">Login</h1>
                <div className="box">

                    {/* Email */}
                    <div className="input">
                        <label htmlFor="">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            {...register('email', { required: 'Email is required', pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ })}
                        />
                        {errors.email && (errors.email.type === 'required'
                            ? <small>{errors.email.message}</small>
                            : <small>Invalid Email</small>
                        )}
                    </div>

                    {/* Password */}
                    <div className="input">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            {...register('password', { required: 'Enter Password', minLength: 6 })}
                        />
                        {errors.password && (errors.password.type === 'required'
                            ? <small>{errors.password.message}</small>
                            : <small>Minimum 6 characters required</small>
                        )}
                    </div>
                </div>
                <div className="buttons">
                    <button className="btn">Sign In</button>
                    <p>
                        Create new account? <Link to='/register' className="link">Sign Up</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Login;