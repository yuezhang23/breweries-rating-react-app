import React, { useEffect, useState } from 'react';
import * as admin from './home';
import * as service from '../Details/service';
import {FaComment, FaEarlybirds, FaHeart, FaPeopleArrows, FaSmile} from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { ProjectState } from '../store';
import * as client from "../User/client";
import {setBrews } from '../Home/brewReducer'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;


function GuestHome() {
  const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
  const {currentBrews} = useSelector((state: ProjectState) => state.brewReducer)
  const [brew, setBrew] = useState({ _id: "", name : ""});
  const [limitedBrews, setLimits] = useState<any[]>([]);
  const [page, setPage] = useState(-1)
  const dispatch = useDispatch();
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate()
    
    

    const fetchUsers = async () => {
      try {
        const users = await client.findAllUsers();
        setUsers(users);
      } catch (error: any) {
        console.error(error.response.data);
      }
    };
  
    useEffect(() => {
      fetchUsers();
      setPage(0)
    }, []);
  
  
    const updateLikes = async (brew : any) =>{
      if (!currentUser) {
        alert('You are not authorized, please Sign In/Up!')
        return
      } 
      const index = await admin.findUserFromLikers(brew._id, currentUser._id)
      if (index) {
        alert('you already liked')
        return
      } else {
        const newBrew = {...brew, likeCount : brew.likeCount + 1, likers : [...brew.likers, currentUser]};
        const newBrews = currentBrews.map((i:any)=> i._id === brew._id? newBrew : i);
        admin.updateBrew(brew._id, newBrew).then((status) =>  dispatch(setBrews(newBrews)));
      }
      alert(`hey, ${currentUser.username} just liked!`)
    }
    
    
    const updateFollowers = async (brew : any) => {
      if (!currentUser) {
        alert('You are not authorized, please Sign In/Up!')
        return
      }
      const index = await admin.findUserFromFollowers(brew._id, currentUser._id)
      if (index) {
        alert('You are already a follower!')
        return
      } else {
        const newBrew = {...brew, followers : [...brew.followers, currentUser], followCount : brew.followCount + 1};
        const newBrews = currentBrews.map((i:any)=> i._id === brew._id? newBrew : i);
        admin.updateBrew(brew._id, newBrew).then((status) => dispatch(setBrews(newBrews)));
      }
      alert(`Hey, ${currentUser.username} just followed!`)
    }
    
    const [review, setReview] = useState({userId : "", comments: ""})
    const [currentID, setCurrent] = useState(" ")
    const updateReviews = async (brew: any, currentComment : any) =>{
      const reviewedBrew = currentBrews.find((i :any) => i._id === brew._id)
      const newReview = [...reviewedBrew.reviews, currentComment]
      const newBrew = {...brew, reviews : newReview}
      const newBrews = currentBrews.map((i:any)=> i._id === brew._id? newBrew : i);
      admin.updateBrew(brew._id, newBrew).then((status) => dispatch(setBrews(newBrews)));
      setCurrent(" ")
    }
  
    const getLikeBrews = (num : Number) => {
      setPage(-1)
      admin.sortBrewByLikes(num).then((brews) => setLimits(brews));    
    }
    
    const getFollowBrews =  (num : Number) => {
      setPage(-1)
      admin.sortBrewByFollowers(num).then((brews) => setLimits(brews));    
    }
    
    const getRandomBrews = (num : Number) => {
      setPage(-1)
      admin.findRandomBrews(num).then((brews) => setLimits(brews));    
    }
  
  
    const searchBrew = async (name : string) => {
      if (name.length > 0) {
        setBrew({...brew, name : name})
        try {
          const namebrews = await admin.findBrewsByName(name)
          setLimits(namebrews)
        } catch (error: any) {
          console.error(error.response.data);
        }
      } else {
        setLimits(currentBrews.slice(page * 10 , page * 10 + 10))
      }
    }
  

   
    const [ownerBrews, setOwnerBrews] = useState<any[]>([])
    const addOwnerBrews = async () => {
      if (currentUser && currentUser.role === "OWNER") {
        try {
          const ownerCls = await admin.findBrewForOwner(currentUser);
          const ownerIds = ownerCls.filter((brewery: any) => brewery.completed && brewery.approved).map((i : any) => i.brewery_ref);     
          // owner automatically like and follow his/her own brewery
          const importBrews = await service.getBreweryFromAPIs(ownerIds, currentUser._id);
          setOwnerBrews([...importBrews])
        } catch (error: any) {
          console.error(error.response.data);
        }
      }
    }
    
    const highLightOwner  = () => {
      if (ownerBrews.length > 0) {
        const updatedBrews = ownerBrews.map((brew : any) => ({ ...brew,  name: `${brew.name} -- Owner`})) 
        setLimits([...updatedBrews, ...limitedBrews])
      } else {
        alert('you have not claimed any breweries yet!')
      }
    }
  
    const checkComment = (id : any) => {
      if (!currentUser) {
        navigate(`/User/Profile/${id}`)
      } else {
        navigate(`/User/Profile/${id}`)
      }
    }
    
  
  
    useEffect(() => {
      setLimits(currentBrews.slice(page * 10 , page * 10 + 10))
    }, [page, currentBrews]);

    
    const myActivities = () => {
        if (!currentUser) {
            alert('Please Log In')
            navigate(`../../User/Signin`)
        } else {
            navigate(`../User/${currentUser._id}`)
        }
    }

    useEffect(() => {
      addOwnerBrews()
    }, [currentUser]);
  
  return (
    <>
        <div className='d-flex ms-5 mb-3'>
            <button onClick={() => highLightOwner()}
              className={currentUser && currentUser.role === "OWNER"? "btn bg-warning-subtle  me-2 " : "d-none"}
              type="button">My Breweries </button>

            <Link to ={ `../Admin`}
            className={currentUser && currentUser.role === "ADMIN"? "btn bg-secondary-subtle me-2" : "d-none"} >
                Settings </Link>
            <button onClick={() => myActivities()}
                className="btn bg-info-subtle me-2 "
            type="button"> My Activities </button>
            
            <input placeholder="search brewery name...." defaultValue={brew.name}
                className="border rounded-4 p-2 me-3 d-none d-sm-block"
                onChange={(e) => searchBrew(e.target.value)}/>   
            <button className="dropdown btn bg-success-subtle me-2 dropdown-toggle " type="button"
                    id="dd" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Views 
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item btn" onClick={() => getLikeBrews(10)}>Top 10 Likes</a>
                <a className="dropdown-item btn" onClick={() => getFollowBrews(10)}>Top 10 Followers</a>
                <a className="dropdown-item btn" onClick={() => getRandomBrews(10)}>Random 10</a>
            </div>
            <button onClick={() => setPage(page -1)}
                className={limitedBrews.length >= 0 && page > 0?"btn bg-outline-secondary-subtle me-2 ": "d-none"}  type="button"
            > {"<< Prev"} </button>
            <button onClick={() => setPage(page +1)}
            className={limitedBrews.length > 0 && page >= 0?"btn bg-outline-secondary-subtle me-2 ": "d-none"} type="button"
            > {"Next >>"}       
            </button>
            <button onClick={() => setPage(0)}
            className={limitedBrews.length === 0 || page === -1?"btn bg-outline-secondary-subtle ": "d-none"} type="button"
            > {">> Front"}          
            </button>
        </div>

        <ul className="list-group rounded-2 d-flex flex-grow-1 ps-5 my-2 "> 
            {!limitedBrews && "there is no result ~~"}
            {limitedBrews && limitedBrews.map((br: any, index : number) => 
            ( 
                <li 
                className={br.name.includes('Owner')? "list-group-item border-warning-subtle border-3" : "list-group-item"} >
                    <div className='row d-flex flex-grow-1 border rounded-2 p-2'>
                    <div 
                        className={br.name.includes('Owner')? "col-3 text-primary text-danger flex-fill" : "col-3 text-primary"} >
                        <FaEarlybirds/> <strong>Brewery</strong>  <br></br><Link to = {`${br.website_url}`} className='text-decoration-none' > <strong>{br.name}</strong></Link> 
                    </div>
                    <div className='col text-success d-none d-md-block'>
                    <strong>Type</strong> {br.brewery_type}
                    </div>
                    <div className='col-2 text-success d-none d-md-block'>
                        <strong>Serving</strong><br></br>
                        {br.beer_types && br.beer_types.map((cm : any) => <li className='ms-4'> {cm} </li>)} 
                    </div>
                    <div className='col-4 text-success d-none d-sm-block'>
                        {/* <ul className='d-none d-sm-block text-decoration-none'> */}
                          <strong>Tel : </strong>{br.phone}<br></br><strong>Address : </strong><br></br>
                        {br.address && Object.entries(br.address).map(([key, value]) => (
                            <span className='font-italic' key={key}>
                            {value as React.ReactNode},
                            </span>
                        ))}
                        {/* </ul> */}
                    </div>
                    <div className='col-2 flex-fill'>
                            <button onClick={() => updateLikes(br)}
                              className= "mb-2 btn btn-sm btn-outline-danger bg-danger-subtle text-danger rounded-5 form-control">
                                  <FaHeart/> like : {br.likeCount} 
                            </button> <br></br>
                            <button onClick={() => updateFollowers(br)}
                            className= "btn btn-sm btn-outline-primary bg-primary-subtle text-primary rounded-5 form-control">
                                <FaPeopleArrows/> follow : {br.followCount}
                            </button>

                            <button onClick={() => setCurrent(br._id)}
                            className={currentUser && !br.name.includes('Owner')? "btn btn-sm rounded-5 btn-outline-secondary bg-secondary-subtle float-end my-2" : "d-none"}>
                                <FaComment/> Comment
                            </button>

                            <Link to = {`/Details/Owner/${br.id}`}
                            className={br.name.includes('Owner')? "btn btn-sm btn-outline-primary bg-info-subtle rounded-4 float-end my-2" : "d-none"}>
                                Manage Details
                            </Link>
                            <textarea placeholder='add comments....' value={review.comments} 
                            className={br._id == currentID? "border form-control" : "d-none"}
                            onChange={(e) => setReview({userId : currentUser._id, comments: e.target.value})}
                            />
                            <button onClick={() => setCurrent(" ")}
                            className={br._id == currentID? "btn btn-sm bg-danger-subtle float-end my-2 ms-2" : "d-none"}>
                                Cancel
                            </button>
                            <button onClick={() => updateReviews(br, review)}
                              className={br._id == currentID? "btn btn-sm bg-success-subtle float-end my-2" : "d-none"}>
                                  Submit
                            </button>
                    </div>   
                    </div>
                    {br.reviews && br.reviews.map((cm : any) => {
                    const usr = users.find((i)=>i._id === cm.userId)
                    if(usr) {
                        return (
                        <span className='py-2 text-warning me-2 p-2'><FaSmile/> {cm.comments} 
                        <button className='btn bg-outline-light rounded- 5 text-danger' 
                        onClick={() => checkComment(usr._id)}
                            > @ {usr.username}</button></span>
                        );}})   
                        }       
                </li>))
                }  
                <span className={ limitedBrews.length == 0 ? "text-danger m-5" : "d-none"}>
                ----------- No Result -----------</span>
        </ul>
    </>
  );
}
export default GuestHome;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}

