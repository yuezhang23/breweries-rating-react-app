import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { setCurrentUser } from "../reducer";
import { Link } from "react-router-dom";
import * as fClient from "../Follows/followClient";
import * as client from "../client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBeer } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
export const BASE_API = process.env.REACT_APP_API_BASE;
axios.defaults.withCredentials = true;

export default function PublicProfile() {
  const { profileId } = useParams();
  const { currentUser } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  const [follows, setFollows] = useState([]);
  const [foNumber, setFoNumber] = useState(0);
  const [ferNumber, setFerNumber] = useState(0);
  const [beers, setBeers] = useState([]);
  const [isSelf, setIsSelf] = useState(false);
  const [profile, setProfile] = useState({ _id: "", description: "", favs: [] });
  const [favoriteBeers, setFavoriteBeers] = useState([]);
  const [beerBrew, setbeerBrew] = useState([]);
  const [filter, setFilter] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  }

  const updateUser = async () => {
    try {
      const user = await client.updateUser(profile._id, profile);
      dispatch(setCurrentUser(user));
      alert('Profile successfully updated.');
    } catch (err) {
      console.log(err.response.data.message)
    }
  };

  const fetchProfile = async () => {
    try {
      const cur = await client.findUserById(profileId);
      setUser(cur);
      const follows = await fClient.followsNumber(profileId);
      const followers = await fClient.followersNumber(profileId);
      setFoNumber(follows)
      setFerNumber(followers)
      const account = await client.profile();
      const u = await client.findUserById(account._id);
      dispatch(setCurrentUser(u));
      setProfile(u)
      if (u) {
        const fos = await fClient.findFollowsOfAUser(u._id);
        setFollows(fos);
        if (u._id === profileId) {
          setIsSelf(true);
        } 
      } 
  
    } catch (err) {
      navigate("/User/Profile")
    }
  }

  const fetchFollows = async () => {
    try {
      if (currentUser) {
      const fos = await fClient.findFollowsOfAUser(currentUser._id);
      setFollows(fos);
    }
    const follows = await fClient.followsNumber(profileId);
    const followers = await fClient.followersNumber(profileId);
    setFoNumber(follows)
    setFerNumber(followers)
    } catch (err) {
      navigate("/User/Profile")
    }
  }

  const following = () => {
    if (!currentUser || !follows) return false;
    return follows.some(fo => fo.follows?._id === profileId);
  }
  
  const followUser = async () => {
    console.log(profile.favs)
    if (!currentUser) {
      alert("Sign in to follow user")
      navigate("/User/Signin")
      return;
    }
    if (user && user.role === "ADMIN") {
      alert("Cannot follow admin")
      navigate("/User/Profile")
      return;
    }
    if (currentUser._id === profileId) {
      alert("This is your profile, cannot follow.")
      return;
    }
    const status = await fClient.followsUser(profileId);
    fetchFollows();
  }

  const unfollowUser = async () => {
    if (!currentUser) {
      alert("Sign in first")
      navigate("/User/Signin")
      return;
    }
    const status = await fClient.unfollowsUser(profileId);
    fetchFollows();
  }
  
  const fetchBeers = async () => {
    const beersUrl = `${BASE_API}/api/beers`;
    const beersResponse = await fetch(beersUrl);
    const beersData = await beersResponse.json();
    setBeers(beersData);
    const cur = await client.findUserById(profileId);
    if (cur && cur.favs && beersData) {
      const favs = cur.favs.map(fav => {
        const beer = beersData.find(beer => beer._id === fav._id);
        return beer ? beer.name : 'Unknown Beer';
      });
      setFavoriteBeers(favs);   
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBeers();
  }, [profileId]);

  const isNewUser = (registerDate) => {
    const registrationDate = new Date(registerDate);
    const now = new Date();
    const diffTime = Math.abs(now - registrationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 10;
  };

  const isVeteranUser = (registerDate) => {
    const registrationDate = new Date(registerDate);
    const now = new Date();
    const diffTime = Math.abs(now - registrationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 10;
  };

  const handleSelectChange = (e) => {

    const selectedOptions = Array.from(e.target.selectedOptions).map(option => ({_id: option.value}));
  
    setProfile(prevProfile => ({
      ...prevProfile,
      favs: selectedOptions
    }));
  };

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h3>Welcome To...</h3>
          {currentUser &&
            <div className="d-flex justify-content-end align-items-center">
            <Link to={`/User/Profile/${profileId}/follows`} className="badge bg-success-subtle text-dark p-2 fs-6 me-2 text-decoration-none">
              Followers 
              <span className="badge bg-light text-dark ms-1">{ferNumber}</span>
            </Link>
            <Link to={`/User/Profile/${profileId}/follows`} className="badge bg-secondary p-2 fs-6 text-decoration-none">
              Follows 
              <span className="badge bg-light text-dark ms-1">{foNumber}</span>
            </Link>
          </div>
          }
        </div>

        <div className="card-body">
          <div className="d-flex align-items-center">
            <h3 className="me-2">{user.username}'s Profile</h3>
            {isNewUser(user.registerDate) && (
              <span className="badge bg-info text-white" title="This user is still new">
                New User
              </span>
            )}
            {isVeteranUser(user.registerDate) && (
              <span className="badge bg-primary-subtle text-dark ms-2" title="This user is a veteran member of the community">
                Veteran User
              </span>
            )}
          </div>
          {following() && currentUser && (currentUser._id !== user._id) ? (
            <button onClick={unfollowUser} className="btn bg-danger-subtle form-control">
              Unfollow
            </button>
            ):(
            <button onClick={followUser} className="btn bg-warning-subtle form-control">
              Follow
            </button>
          )}

        {isSelf ? (
          <>
          <h4 className="mt-4">Update Your description</h4>
            <button className="badge bg-success-subtle text-dark mt-3 mb-2 float-end" 
              onClick={updateUser}> Update Description to Display</button>
            <textarea
              className="form-control"
              value={profile.description}
              onChange = {(e) => setProfile({ ...profile, description: e.target.value })}
              placeholder="Describe yourself here..."
            />
            
          </>
        ) : (
        <div className="card mt-3">
          <div className="card-body bg-dark-subtle fw-bold">
            <p className="card-text ">{user.description || "User has nothing to show here"}</p>
          </div>
        </div>
        )}

        {isSelf ? <div className="profile-container">
          <button className="badge bg-success-subtle text-dark mt-3 mb-2 float-end" 
                onClick={updateUser}> Update Your Fav Beer To Display</button>
          <h4 className="mt-4">Multi Select Your Favorite Beers</h4>
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Search beers..."
            className="form-control mb-2"
          />
          <select multiple className="form-control" size="5" style={{ overflowY: 'scroll' }} 
            onChange = {(e) => {handleSelectChange(e)}} >
            {beers
              .filter(beer => beer.name.toLowerCase().startsWith(filter))
              .map((beer) => (
                <option key={beer._id} value={beer._id} selected={profile.favs.some(fav => fav._id === beer._id)}>
                {beer.name}
              </option>
            ))}
          </select>
        </div> :
        <div className="accordion mt-3" id="accordionExample">
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                My Favorite Beers
              </button>
            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <ul>
                  {favoriteBeers.length > 0 ? favoriteBeers.map((beer, index) => (
                    <li key={index}>
                      <FontAwesomeIcon icon={faBeer} className="me-2" />
                      {beer}
                    </li>
                  )) : <p>User has no favorite beers</p>}
                </ul>
              </div>
            </div>
          </div>
        </div>
        }
      </div>      
    </div>


    </div>
  )

}