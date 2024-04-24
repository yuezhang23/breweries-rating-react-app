import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "../Details/DetailBrewery/OwnClaim/client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import axios from "axios";
import { Claim } from "../Details/DetailBrewery/OwnClaim/client";
axios.defaults.withCredentials = true;

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>();
  const navigate = useNavigate();
  
  
  return (
    <div className="container-fluid">
      <Link to="/User/Profile" className="btn bg-warning-subtle w-100 mb-2">
        Back to Your Profile page
      </Link>
        <h3>You Claim Requests</h3>
        <ul className="list-group">
          {claims?.map((claim, index) => (
            <li key={index} className="list-group-item">
                {claim.brewery_url}
            </li>
          ))}
        </ul>
    </div>
  );
}

