import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import axios from "axios";
import { setCurrentUser } from "./reducer";
axios.defaults.withCredentials = true;
const adminCode = "ADMIN";

export default function Signup() {
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [pmt, setPmt] = useState("");
  const [code, setCode] = useState("");
  const [user, setUser] = useState({ username: "", password: "", firstName: "", lastName: "", email: "", dob: "", role: "USER"});
  const navigate = useNavigate();

  const signup = async () => {
    try {
      if (user.role === "PREMIUM_USER" && pmt.length !== 16) {
        setError("Enter a valid 16 digits payment info.")
        setUser({...user, role: "USER"})
        setIsPremium("");
        setIsAdmin("");
        return;
      } else if (user.role === "ADMIN" && code!== adminCode) {
        setError("Enter a valid admin code to register as an admin.");
        setIsPremium("");
        setIsAdmin("");
        setUser({...user, role: "USER"})
        return;
      }
      const newUser = await client.signup(user);
      setCurrentUser(newUser);
      navigate("/User/Signin");
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  const confirmRole = (r: string) => {
    if (r === "PREMIUM_USER") {
      setIsAdmin("");
      setIsPremium("Please set up your payment to upgrade as a premium user:");
    } else if (r === "ADMIN") {
      setIsPremium("");
      setIsAdmin("Please Enter code to register as an Admin:");
    } else {
      setIsPremium("");
      setIsAdmin("");
    }
    setUser({...user, role: r}) 
  }

  return (
    <div className="container-fluid">
      <h1>Sign Up</h1>
      {error && <div className="alert alert-danger my-1">{error}</div>}
      <div className='m-3'>
        <div className="mb-3">
          <label htmlFor="userUsername" className="form-label">Username: </label>
          <input
              className="form-control"
              value={user.username}
              id="userUsername"
              onChange={(e) => setUser({ ...user, username: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label htmlFor="userPassword" className="form-label">Password: </label>
          <input
              type="password"
              className="form-control"
              value={user.password} id="userPassword"
              onChange={(e) => setUser({ ...user, password: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label htmlFor="userEmail" className="form-label">Email: </label>
          <input
              type="email"
              className="form-control"
              value={user.email}
              id="userEmail"
              onChange={(e) => setUser({ ...user, email: e.target.value })} />
          </div>
          <div className="mb-3">
            <label htmlFor="userFirstName" className="form-label">First Name: </label>
            <input
                type="text"
                className="form-control"
                value={user.firstName}
                id="userFirstName"
                onChange={(e) => setUser({ ...user, firstName: e.target.value })} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="userLastName" className="form-label">Last Name: </label>
            <input
                type="text"
                className="form-control" id="userLastName"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="userDob" className="form-label">Date of birth: </label>
            <input
                type="date"
                className="form-control"
                id="userDob"
                value={user.dob}
                onChange={(e) => setUser({ ...user, dob: e.target.value })} />
          </div>

          <div className="mb-3">
            <label htmlFor="userRole" className="form-label">Register Type: </label>
            <select className="form-select mb-2" id="userRole" value={user.role} onChange={(e) =>
                {confirmRole(e.target.value)}}>
              <option value="USER">User</option>
              <option value="PREMIUM_USER">Premium User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            {isPremium && 
            <>
              <div className="alert alert-warning my-1">{isPremium}</div>
              <label htmlFor="patron" className="form-label">Become a Patron(Payment info): </label>
              <input className="form-control" id="patron" value={pmt} 
                onChange={(e) => setPmt(e.target.value)} />
            </>
            }
            {isAdmin && 
            <>
              <div className="alert alert-warning my-1">{isAdmin}</div>
              <label htmlFor="admins" className="form-label">Enter your admin code: </label>
              <input className="form-control" id="admins" value={code} 
                onChange={(e) => setCode(e.target.value)} />
            </>
            }
            </div>

          <button onClick={signup} className="btn bg-primary-subtle form-control">
              Sign Up
          </button>
      </div>
    </div>
  );
}

