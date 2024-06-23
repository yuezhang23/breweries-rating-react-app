import React, { useEffect, useState } from 'react';
import * as client from "../User/client";
import * as admin from './home';
import { useNavigate} from 'react-router';
import * as common from './home';
import { useDispatch, useSelector } from 'react-redux';
import {setBrews } from '../Home/brewReducer'
import { ProjectState } from '../store';
import axios from "axios";
import { FaEarlybirds, FaSmile } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaHeart, FaPeopleArrows } from 'react-icons/fa6';
axios.defaults.withCredentials = true;

function UsrHome() {
  const [carebrews, setCareBrews] = useState<any[]>([]);
  const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
  const {currentBrews} = useSelector((state: ProjectState) => state.brewReducer)
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [doneLike, SetLike] = useState(false);
  const [doneFollow, SetFollow] = useState(false);


  const searchBrewsUserCared = async () =>{
    if (!currentUser) {
      alert('You are not authorized, please Sign In/Up!')
      return
    } 
    const brewsFromUser = await common.findBrewsUserCared(currentUser._id)
    if (brewsFromUser.length === 0) {
      alert('you have never liked/followed/commented on any brewery')
    } else {
      setCareBrews(brewsFromUser)
    }
  }

  const fetchUsers = async () => {
    try {
      const users = await client.findAllUsers();
      setUsers(users);
    } catch (error: any) {
      console.error(error.response.data);
    }
  };


  const unLikes = async (brew : any) =>{
    // keep click button bug
    if (!doneLike) {
      const newBrew = {...brew, likeCount : brew.likeCount - 1, likers : brew.likers.filter((i :any) => i._id != currentUser._id)};
      const newBrews = currentBrews.map((i)=> i._id === brew._id? newBrew : i);
      admin.updateBrew(brew._id, newBrew).then((status) => dispatch(setBrews(newBrews)));
      SetLike(!doneLike);
    }
  };
  
  const unFollowers = async (brew : any) =>{
    if (!doneFollow) {
      const newBrew = {...brew, followers : brew.followers.filter((i :any) => i._id != currentUser._id), followCount : brew.followCount - 1};
      const newBrews = currentBrews.map((i)=> i._id === brew._id? newBrew : i);
      admin.updateBrew(brew._id, newBrew).then((status) => dispatch(setBrews(newBrews)));
      SetFollow(!doneFollow);
    }
  };

  
  useEffect(() => {
    searchBrewsUserCared()
    fetchUsers()
  }, [currentUser, currentBrews]);


  const checkComment = (id : any) => {
    if (!currentUser) {
      alert('you need to sign in')
      navigate(`/User/Signin`)
    } else {
      navigate(`/User/Profile/${id}`)
    }
  }

  const findUsrName = (id : any) =>{
    try {
      const nameU = users.find((i) => i._id === id).username
      return nameU
    } catch (error) {

    }
  }


  return (
    <>
      <div className='px-5 fs-4 mb-4' > 
        Welcome  <strong className='text-danger'> @ {  currentUser && currentUser.username }</strong>
        <Link to = {`/Home/User`}
        className='btn btn-outline-danger ms-3 rounded-4'> Home </Link>
      </div>
      <div className='px-5 fs-4 mb-3' > Breweries You ever <strong className='text-danger'>Liked/Followed/Commented</strong></div>
      <ul className="list-group d-flex flex-grow-1 ps-5"> 
          {carebrews && carebrews.map((br: any) => 
           ( 
            <li 
              className= "list-group-item " >
                <div className='row'>
                  <div 
                    className= "col-3 text-primary" >
                      <strong className='fs-5'> <FaEarlybirds/> Brewery :  </strong>  <br></br>
                      {/* <strong className='fs-5 text-danger'>  {br.name}   </strong>  */}
                     <Link to = {`${br.website_url}`}  className='text-decoration-none'>  <strong className='text-primary'>{br.name}</strong> </Link>
                     <p></p>
                     <button onClick={() => unLikes(br)}
                        className= "mb-2 btn btn-sm btn-outline-primary bg-primary-subtle text-danger rounded-5">
                            <FaHeart/> Unlike
                      </button> <br></br>
                      <button onClick={() => unFollowers(br)}
                      className= "btn btn-sm btn-outline-primary bg-primary-subtle text-danger rounded-5">
                          <FaPeopleArrows/> Unfollow 
                      </button>
                     
                  </div>
                  {/* <div className='col text-primary d-none d-md-block'>
                  <strong className='fs-5'> Website  </strong> <br></br>
                  </div> */}
                  {/* <div className='col'>
                      {br.beer_types && br.beer_types.map((cm : any) => <li className='ms-4'> <strong>{cm }</strong> </li>)} 
                      {! br.beer_types && 'None'}
                  </div> */}
                  <div className='col text-primary d-none d-md-block'>
                  <strong className='fs-5'> 
                    Contact
                  </strong>  <br></br>
                  <strong>Tel :</strong>  {br.phone || "null"}<br></br>
                      {/* {br.address && Object.entries(br.address).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value as React.ReactNode}
                        </div>
                      ))} */}

                  </div>
                  <div  className='col text-primary'>
                  <strong className='fs-5'> 
                    Likers
                  </strong>  
                    {br.likers && br.likers.map((cm : any) => 
                        <div
                          className={cm._id === currentUser._id ? 'py-2 text-danger':'py-2 text-warning'} >
                          <FaSmile/> 
                          <button 
                    className={cm._id === currentUser._id? 'btn btn-outline-light btn-sm py-2 text-danger':'btn btn-outline-light text-warning'} 
                          onClick={() => checkComment(findUsrName(cm._id))}
                            > @ {findUsrName(cm._id)} </button>
                        </div>
                      )}
                  </div>
                  <div className='col text-primary'>
                  <strong className='fs-5'>  
                    Followers
                    </strong>  
                    {br.followers && br.followers.map((cm : any) => 
                      <div
                          className={cm._id === currentUser._id? 'py-2 text-danger':'py-2 text-warning'} >
                          <FaSmile/> 
                          <button 
                          className={cm._id === currentUser._id? 'btn btn-outline-light text-danger':'btn btn-outline-light text-warning'} 
                          onClick={() => checkComment(findUsrName(cm._id))}>
                             @ {findUsrName(cm._id)} </button>
                          </div>
                      )} 
                  </div>
                  <div className='col text-primary'>
                  <strong className='fs-5'>
                    Comments
                    </strong>   
                    {br.reviews && br.reviews.map((cm : any) => 
                        <div className='py-2 text-warning'> 
                          {cm.comments} 
                        <button  
                        className={cm.userId === currentUser._id? 'btn btn-outline-light text-danger':'btn btn-outline-light text-warning'} 
                          onClick={() => checkComment(findUsrName(cm.userId))}
                            > @ {findUsrName(cm.userId)} </button>
                        </div>
                      )}     
                  </div>
                </div>            
            </li>))
            }  
            <span className={carebrews.length == 0 ? "text-danger m-5" : "d-none"}>
              ----------- No Result -----------</span>
      </ul>
       
    </>

  );
}
export default UsrHome;