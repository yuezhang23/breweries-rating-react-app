import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "./client";
import * as client from "./client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({ username: "", password: ""});

  const navigate = useNavigate();
  
  const signin = async () => {
    try {
      await client.signin(credentials);
      navigate("/User/Profile");
    } catch (err: any) {
      alert(err.response.data)
    }
  };
  
  return (
    <div>
      <h1>Signin</h1>
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
