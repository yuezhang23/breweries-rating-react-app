import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as fClient from './followClient';
import { User } from './client';

function FollowDetails() {
  const { userId } = useParams();
  const { currentUser } = useSelector((state: any) => state.userReducer);

  const [followers, setFollowers] = useState([]);
  const [follows, setFollows] = useState([]);

  const fetchFollowers = async () => {
    const allFollowers = await fClient.findFollowersOfAUser(userId);
    setFollowers(allFollowers);
  }

  const fetchFollows = async () => {
    const allFollows = await fClient.findFollowsOfAUser(userId);
    setFollows(allFollows);
  }

  useEffect(() => {
    fetchFollowers();
    fetchFollows();
}, [userId])

  return (
    <div className="container-fluid">
       <h3>Followers</h3>
       <ul className="list-group">
            {followers.map((follower: User, index) => (
              <li key={index} className="list-group-item">
                <Link to={`/Users/${follower}`}>
                  {follower.username}
                </Link>
              </li>
            ))}
        </ul>
      
    </div>
  );
}

export default FollowDetails;
  