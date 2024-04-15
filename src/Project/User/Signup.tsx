import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function Signup() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({ username: "", password: "", firstName: "", lastName: "", email: "", dob: "", role: "USER"});
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await client.signup(user);
      setSuccess("User successfully created.");
      navigate("/User/Profile");
    } catch (err: any) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="container-fluid mt-5">
      <h1>Sign Up</h1>
      {error && <div className="alert alert-danger my-1">{error}</div>}
      {success && <div className="alert alert-success my-1">{success}</div>}
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
              <label htmlFor="userBirthday" className="form-label">Date of birth: </label>
              <input
                  type="date"
                  className="form-control"
                  id="userBirthday"
                  value={user.dob}
                  onChange={(e) => setUser({ ...user, dob: e.target.value })} />
          </div>
          <button onClick={signup} className="btn btn-primary">
              Sign Up
          </button>
      </div>
    </div>
  );
}

