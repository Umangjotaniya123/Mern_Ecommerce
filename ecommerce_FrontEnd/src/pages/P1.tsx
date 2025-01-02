import { ChangeEvent, useState } from "react";
import { Address, User } from "../types/types";
import { useUpdateUserMutation } from "../redux/api/userAPI";
import { server } from "../redux/store";
import { responseToast, validateForm } from "../utils/features";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import FormCard from "../components/F1Card";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const initialValue: Address = {
  address: '',
  city: '',
  state: '',
  country: '',
  pincode: undefined,
  addType: '',
}

const Profile = () => {

  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  )

  const navigate = useNavigate();
  const [view, setView] = useState(true);

  const [name, setName] = useState<string>(user?.name!);
  const [gender, setGender] = useState<string>(user?.gender!);
  const [email, setEmail] = useState<string>(user?.email!);
  const [photoPrev, setPhotoPrev] = useState<string>(user?.photo!);
  const [dob, setDob] = useState<string>(user?.dob!);
  const [photo, setPhoto] = useState<File>();
  const [img, setImg] = useState(`${server}/${photoPrev}`);
  const [addressInfo, setAddressInfo] = useState<Address[]>(user?.addressInfo || []);
  // console.log(addressInfo);
  const [newAddressInfo, setNewAddressInfo] = useState<Address[]>([])

  const [errors, setErrors] = useState<any>({});
  const [userUpdate] = useUpdateUserMutation();

  const date = dob.split("T")[0];
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  ).toISOString().split("T")[0]

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    // setErrors({ photo: '' });

    if (!file?.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      // setErrors({ photo: 'select valid image.' });
      return;
    }

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setImg(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  const handleSubmite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();



    const temp = validateForm({
      name, email, gender, dob, addressInfo: [...addressInfo, ...newAddressInfo]
    });
    if (temp) {
      setErrors(
        temp
      );
      // console.log(temp);
      return;
    }
    else setErrors({});


    let updateAddressInfo = [...addressInfo];
    if (JSON.stringify(initialValue) !== JSON.stringify(newAddressInfo)) {
      updateAddressInfo = [...updateAddressInfo, ...newAddressInfo]
      setAddressInfo(() => updateAddressInfo);
    }
    // console.log(newAddressInfo);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("gender", gender);
    formData.set("email", email);
    formData.set("dob", date);
    formData.set("photo", photo!);
    formData.set("_id", user?._id!);
    formData.append("addressInfo", JSON.stringify(updateAddressInfo));

    const res = await userUpdate({ userId: user?._id!, formData });
    if ("data" in res) {
      setView(!view);
      setNewAddressInfo([]);
    }
    responseToast(res, navigate, "/profile");
  };

  const handleBack = () => {
    setView(!view);
    setErrors({});
    setNewAddressInfo([]);
    navigate("/profile");
  }

  // useEffect(() => {
  //   if (!view) {
  //     // Reset state to match database values
  //     setName(user?.name || "");
  //     setGender(user?.gender || "");
  //     setEmail(user?.email || "");
  //     setDob(user?.dob || "");
  //     setAddressInfo(user?.addressInfo || []);
  //     setNewAddressInfo([]);
  //     setErrors({});
  //   }
  // }, [view, user]);

  const handleAdd = () => {
    setNewAddressInfo([...newAddressInfo, initialValue]);
  }

  return (
    <>
      {view ? (
        <div className="profile">
          <main>
            <h1 className="heading">Profile</h1>
            <div className="box">
              <div className="box_left">
                <img src={img} alt="Photo" />
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
      ) : (
        <div className="editProfile">
          <button className="back-btn" onClick={handleBack}><BiArrowBack /></button>
          <form onSubmit={handleSubmite}>
            <h1 className="heading">Edit Profile</h1>
            <div className="box">
              {/* <div className="box_left"> */}
              <div className="input">
                <label htmlFor="">Photo</label>
                <div>
                  <img src={img} alt="Photo" />
                  <input type="file" name="myImage" accept="image/*" onChange={changeImageHandler} />
                </div>
                {errors.photo && <small>{errors.photo}</small>}
              </div>
              <div className="input">
                <label htmlFor="">Name</label>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  value={name}
                />
                {errors.name && <small>{errors.name}</small>}
              </div>
              <div className="input">
                <label htmlFor="">Email</label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  value={email}
                />
                {errors.email && <small>{errors.email}</small>}
              </div>
              <div className="input">
                <label htmlFor="">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && <small>{errors.gender}</small>}
              </div>
              <div className="input">
                <label htmlFor="">Date of Birth</label>
                <input
                  type="date"
                  value={date}
                  max={maxDate}
                  onChange={(e) => setDob(e.target.value)}
                />
                {errors.dob && <small>{errors.dob}</small>}
              </div>
            </div>

            <div>
              <FormCard
                addressInfo={addressInfo || []}
                setAddressInfo={setAddressInfo}
                id={user?._id!}
                errors={errors.addressInfo || []}
                setErrors={setErrors}
              />
            </div>
            <FormCard
              addressInfo={newAddressInfo || []}
              setAddressInfo={setNewAddressInfo}
              id={user?._id!}
              errors={errors.addressInfo?.slice(addressInfo.length) || []}
              setErrors={setErrors}
            />
            <div className="add">
              <h4>Add AdressInfo</h4>
              <p className="puls">
                <FaPlus onClick={handleAdd} />
              </p>
            </div>
            <div className="buttons">
              <button className="cancel" onClick={handleBack}>Cancel</button>
              <button className="btn">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Profile;


