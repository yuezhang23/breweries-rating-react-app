import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({ username: "", password: ""});
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  
  const signin = async () => {
    try {
      const currentUser = await client.signin(credentials);
      dispatch(setCurrentUser(currentUser));
      navigate("/User/Profile");
    } catch (err: any) {
      setError(err.response.data);
    }
  };
  
  return (
    <div className="container-fluid mt-5">
      <h1>Sign In</h1>
      {error && <div className="alert alert-danger my-1">{error}</div>}
      <input value={credentials.username} className="form-control mb-2" onChange={(e) =>
        setCredentials({ ...credentials, username: e.target.value })}/>
      <input value={credentials.password} className="form-control mb-2" type="password"
       onChange={(e) =>
        setCredentials({ ...credentials, password: e.target.value })}/>
      <button onClick={signin} className="btn btn-primary form-control mb-2"> Signin </button>

      <Link to={"/User/Signup"} className="btn btn-warning form-control">
        Signup
      </Link>
    </div>
  );
}
