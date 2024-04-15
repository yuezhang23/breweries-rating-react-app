import * as client from "./client";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

const formatDate = (date: any) => {
  if (!date) return "";
  const d = new Date(date);
  d.setDate(d.getDate() + 1); 
  
  let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
};

export default function Profile() {
  const [profile, setProfile] = useState({ username: "", password: "", 
    firstName: "", lastName: "", dob: "", email: "", role: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAdmin, setIsAdmin] = useState(false);

  const onChangeDate = (e: any) => {
    const inputDate = new Date(e.target.value);
    const formattedDate = formatDate(inputDate);
    setProfile({ ...profile, dob: formattedDate });
  };

  const adminAuth = (profile: any) => {
    if (profile.role === "ADMIN") {
      setIsAdmin(true);
    }
  }

  const fetchProfile = async () => {
    try {
      const account = await client.profile();
      adminAuth(account)
      setProfile(account);
    } catch (err) {
      navigate("/User/Signin");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const save = async () => {
    await client.updateUser(profile);
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/User/Signin");
  };

  return (
    <div className="container-fluid mt-5">
      <h1>Profile</h1>
      {isAdmin && 
        <>
          <Link to="/User/Account/Admin/Users" className="btn btn-warning w-100 mb-2">
            Users
          </Link>
          <Link to="/User/Account/Admin/Orders" className="btn btn-warning w-100 mb-2">
            All Orders
          </Link>
        </>
      }

      {profile && (
        <div>
          <input value={profile.username} className="form-control mb-2" onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })} required/>
          <input value={profile.password} type="password" className="form-control mb-2" onChange={(e) =>
            setProfile({ ...profile, password: e.target.value })} required/>
          <input value={profile.firstName} className="form-control mb-2" onChange={(e) =>
            setProfile({ ...profile, firstName: e.target.value })} required/>
          <input value={profile.lastName} className="form-control mb-2" onChange={(e) =>
            setProfile({ ...profile, lastName: e.target.value })} required/>
          <input value={formatDate(profile.dob)} type="date" className="form-control mb-2" onChange={onChangeDate}/>
          <input value={profile.email} className="form-control mb-2" onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })} required/>
          <button onClick={save} className="btn btn-primary form-control mb-2">
            Save
          </button>
          <button onClick={signout} className="btn btn-danger form-control">
            Signout
          </button>

        </div>
        
      )}
    </div>
  );
}
