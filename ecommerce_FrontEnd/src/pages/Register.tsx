import { useForm } from "react-hook-form";
import { User } from "../types/types";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/api/userAPI";
import { responseToast } from "../utils/features";

const Register = () => {

    const [registerUser] = useRegisterMutation();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<User>({
        defaultValues: {
            name: '',
            gender: '',
            password: '',
            email: '',
            dob: '',
        }
    });

    const onSubmit = async (data: User) => {
        // console.log(data);

        const res = await registerUser(data);
        responseToast(res, navigate, '/');
        // console.log(res);
    }

    const today = new Date();
    const maxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    ).toISOString().split("T")[0]

    return (
        <div className="register">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="heading">Register</h1>
                <div className="box">

                    {/* Profile name */}
                    <div className="input">
                        <label htmlFor="">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <small>{errors?.name.message}</small>}
                    </div>

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

                    <div className="input">
                        <label>Password</label>
                        <input 
                            type="password"
                            placeholder="Password"
                            {...register('password', { required: 'Enter Password', minLength: 6})}
                        />
                        {errors.password && (errors.password.type === 'required'
                            ? <small>{errors.password.message}</small>
                            : <small>Minimum 6 characters required</small>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="input">
                        <label htmlFor="">Gender</label>
                        <select
                            {...register('gender', { required: 'Gender is required' })}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.gender && <small>{errors.gender.message}</small>}
                    </div>

                    {/* Date of Birth */}
                    <div className="input">
                        <label htmlFor="">Date of Birth</label>
                        <input
                            type="date"
                            max={maxDate}
                            {...register('dob', { required: 'Enter valid date', max: maxDate })}
                        />
                        {errors.dob && <small>{errors.dob.message}</small>}
                    </div>
                </div>
                <div className="buttons">
                    <button className="btn">Sign Up</button>
                    <p>
                        You have an account? <Link to='/login' className="link">Login</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Register;