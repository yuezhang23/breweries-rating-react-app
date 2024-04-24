import { useEffect, useState } from "react";
import {followsNumber, followersNumber} from "./followClient";
import * as client from "../client"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const FollowComponent = ({id}: {id: any}) => {

  const [fo, setFo] = useState(0);
  const [fer, setFer] = useState(0);
  
  const navigate = useNavigate();

  const fetchFollow = async () => {
    try {
      if (!id) {
        navigate("/User/Signin");
      }
      const follows = await followsNumber(id);
      const followers = await followersNumber(id);
      setFo(follows)
      setFer(followers)
    } catch (err) {
      navigate("/User/Signin");
    }
  };

  useEffect(() => {
    fetchFollow();
  }, []);

  return (
    <div className="d-flex justify-content-end align-items-center">
      <Link to={`/User/Profile/${id}/follows`} className="badge bg-success-subtle text-dark p-2 fs-6 me-2 text-decoration-none">
        Followers 
        <span className="badge bg-light text-dark ms-1">{fer}</span>
      </Link>
      <Link to={`/User/Profile/${id}/follows`} className="badge bg-secondary p-2 fs-6 text-decoration-none">
        Follows 
        <span className="badge bg-light text-dark ms-1">{fo}</span>
      </Link>
    </div>
    
  );
};

export default FollowComponent;