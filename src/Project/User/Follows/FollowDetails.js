import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as fClient from './followClient';
import axios from 'axios';
axios.defaults.withCredentials = true;

function FollowDetails() {
  const { profileId } = useParams();
  const { currentUser } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  const auth = () => {
    if(!currentUser) {
      alert("Please login to see user's follows/followers.")
      navigate("/User/Signin");
    }
  }

  const [followerss, setFollowerss] = useState([]);
  const [followss, setFollowss] = useState([]);

  const fetchFollowers = async () => {
    try {
      const allFollowers = await fClient.findFollowersOfAUser(profileId);
      setFollowerss(allFollowers);
    } catch (err) {
      navigate("/User/Signin");
      console.error(err.response.data);
    }
  }

  const fetchFollows = async () => {
    try {
      const allFollows = await fClient.findFollowsOfAUser(profileId);
      setFollowss(allFollows); 
    } catch (err) {
      console.error(err.response.data);
    }
  }

  useEffect(() => {
    fetchFollowers();
    fetchFollows();
    auth();
}, [profileId])

  return (
    <div className="container-fluid">
      <Link to="/User/Profile" className="btn bg-warning-subtle w-100 mb-2">
        Back to Your Profile page
      </Link>
        <h3>Follows</h3>
        <ul className="list-group">
          {followss.map((fows, index) => (
            <li key={index} className="list-group-item">
              <Link to={`/User/Profile/${fows.follows._id}`} className='text-decoration-none'>
                {fows.follows.username}
              </Link>
            </li>
          ))}
        </ul>
       <h3>Followers</h3>
      <ul className="list-group">
        {followerss.map((fwer, index) => (
          <li key={index} className="list-group-item">
            <Link to={`/User/Profile/${fwer.follower._id}`} className='text-decoration-none'>
              {fwer.follower.username}
            </Link>
          </li>
        ))}
        </ul>

      
    </div>
  );
}

export default FollowDetails;
  