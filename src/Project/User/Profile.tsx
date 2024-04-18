import * as client from "./client";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./reducer";
import axios from "axios";
import { ProjectState } from "../store";
axios.defaults.withCredentials = true;

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
  const { currentUser } = useSelector((state: ProjectState) => state.userReducer);

  const [profile, setProfile] = useState({ _id: "", username: "", password: "", 
    firstName: "", lastName: "", dob: "", email: "", role: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState("");

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
      const user = await client.findUserById(account._id);
      dispatch(setCurrentUser(user));
      adminAuth(user);
      setProfile(user);
    } catch (err) {
      navigate("/User/Signin");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateUser = async () => {
    try {
      const user = await client.updateUser(profile._id, profile);
      dispatch(setCurrentUser(user));
      setComplete("Profile successfully updated.")
      setError("");
    } catch (err: any) {
      setError(err.response.data.message)
    }
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/User/Signin");
  };

  return (
    <div className="container-fluid">
      
      {isAdmin && 
        <Link to="/User/Admin/Users" className="btn bg-warning-subtle w-100 mb-2">
          Users
        </Link>
      }

      {profile && (
        <div>
          <h4>Welcome, {profile.username}</h4>
          {error && <div className="alert alert-danger my-1">{error}</div>}
          {complete && <div className="alert alert-success my-1">{complete}</div>}

          <label htmlFor="userUsername" className="form-label">Username: </label>
          <input
              type="text"
              className="form-control"
              value={profile.username}
              id="userUsername"
              onChange={(e) => setProfile({ ...profile, username: e.target.value })} required/>

          <label htmlFor="userPassword" className="form-label mt-2">Password: </label>
          <input
              type="password"
              className="form-control"
              value={profile.password}
              id="userPassword"
              onChange={(e) => setProfile({ ...profile, password: e.target.value })} required/>

          <label htmlFor="userEmail" className="form-label mt-2">Email: </label>
          <input
              type="email"
              className="form-control"
              value={profile.email}
              id="userEmail"
              onChange={(e) => setProfile({ ...profile, email: e.target.value })} required/>
          
          <label htmlFor="userFirstName" className="form-label mt-2">First Name: </label>
          <input
              type="text"
              className="form-control"
              value={profile.firstName}
              id="userFirstName"
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} required/>
          <label htmlFor="userLastName" className="form-label mt-2">Last Name: </label>
          <input
              type="text"
              className="form-control"
              id="userLastName"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} required/>
          <label htmlFor="userBirthday" className="form-label mt-2">Date of birth: </label>
          <input
              type="date"
              className="form-control mb-3"
              id="userBirthday"
              value={formatDate(profile.dob)}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
          />

          <button onClick={updateUser} className="btn bg-primary-subtle form-control mb-2">
            Save
          </button>
          <button onClick={signout} className="btn bg-danger-subtle form-control">
            Signout
          </button>

        </div>
        
      )}
    </div>
  );
}
