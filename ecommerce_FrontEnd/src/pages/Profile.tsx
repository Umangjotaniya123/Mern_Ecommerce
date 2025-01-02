import { useState } from "react";
import { User } from "../types/types";
import { useUpdateUserMutation } from "../redux/api/userAPI";
import { server } from "../redux/store";
import { responseToast } from "../utils/features";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import AddressList from "../components/AddressList";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Profile = () => {

    const { user: updateUser, loading } = useSelector(
        (state: RootState) => state.userReducer
      )
    const [user, setUser] = useState<User>(updateUser!);
    const { name, gender, email } = user!;

    const methods = useForm<User>({
        defaultValues: {
            name: user?.name,
            gender: user?.gender,
            email: user?.email,
            photo: user?.photo,
            dob: user?.dob.split("T")[0],
            addressInfo: user?.addressInfo,
        }
    });

    const { register, handleSubmit, control, formState: { errors }, clearErrors, reset } = methods;

    const fieldsArray = useFieldArray({
        name: "addressInfo",
        control,
    })

    const [userUpdate] = useUpdateUserMutation();
    const navigate = useNavigate();

    const [view, setView] = useState(true);
    const [img, setImg] = useState(`${server}/${user?.photo}`);
    const date = user?.dob.split("T")[0];
    const today = new Date();
    const maxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    ).toISOString().split("T")[0]

    const onSubmit = async (data: User) => {
        // console.log(data);
        const formData = new FormData();

        // Add all non-file fields to FormData
        formData.append('name', data.name);
        formData.append('gender', data.gender);
        formData.append('email', data.email);
        formData.append('dob', data.dob);

        // Add addressInfo as a JSON string
        formData.append('addressInfo', JSON.stringify(data.addressInfo));

        // Handle file upload
        if (data.photo && (data.photo as unknown as FileList)[0] && typeof data.photo === 'object') {

            const file: File | undefined = (data.photo as unknown as FileList)[0];
            const reader: FileReader = new FileReader();

            if (file) {
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    if (typeof reader.result === "string") {
                        setImg(reader.result);
                    }
                };
            }
            formData.append('photo', file);
        }
        
        // console.log(data.photo);
        const res = await userUpdate({
            formData,
            userId: user?._id!,
        });
        // console.log(res);
        if ('data' in res) {
            setUser({
                ...updateUser,
                name: data?.name!,
                gender: data?.gender!,
                email: data?.email!,
                photo: data?.photo!,
                dob: data?.dob!,
                addressInfo: data?.addressInfo!,
            } as User);
            setView(true);
        }

        responseToast(res, navigate, '/profile');
    };

    // console.log(errors);

    const handleBack = () => {
        setView(true);
        clearErrors(); // Clear all errors
        reset();       // Reset all fields to default values
    };


    return (
        <>
            {view ? ( // Profiile Details
                <div className="profile">
                    <main>
                        <h1 className="heading">Profile</h1>
                        <div className="box">
                            <div className="box_left">
                            {user?.photo && <img src={img} alt="Photo" />}
                                <p>{name}</p>
                            </div>
                            <div className="box_right">
                                <div>
                                    <h5>Name :</h5>
                                    <p>{name}</p>
                                </div>
                                <div>
                                    <h5>Email :</h5>
                                    <p>{email}</p>
                                </div>
                                <div>
                                    <h5>Gender :</h5>
                                    <p>{gender}</p>
                                </div><div>
                                    <h5>Date of Birth :</h5>
                                    <p>{date}</p>
                                </div>
                            </div>
                        </div>
                    </main>
                    <button className='btn' onClick={() => setView(!view)}>Edit Profile</button>
                </div>
            ) : ( // Profile Edit
                <div className="editProfile">
                    <button className="back-btn" onClick={handleBack}><BiArrowBack /></button>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h1 className="heading">Edit Profile</h1>
                            <div className="box">
                                {/* Profile Photo */}
                                <div className="input">
                                    <label htmlFor="">Photo</label>
                                    <div>
                                        <img src={img} alt="Photo" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            {...register('photo')}
                                        />
                                    </div>
                                </div>

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
                                        defaultValue={date}
                                        type="date"
                                        max={maxDate}
                                        {...register('dob', { required: 'Enter valid date', max: maxDate })}
                                    />
                                    {errors.dob && <small>{errors.dob.message}</small>}
                                </div>
                            </div>

                            {/* Address_Information */}
                            <AddressList fieldsArray={fieldsArray} />

                            <div className="buttons">
                                <button className="cancel" onClick={handleBack}>Cancel</button>
                                <button className="btn">Save Changes</button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            )}
        </>
    );
}
export default Profile;


