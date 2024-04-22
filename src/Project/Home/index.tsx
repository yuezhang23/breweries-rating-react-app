import React, { useEffect, useState } from 'react';
import * as admin from './admin';
import {FaEarlybirds, FaPeopleArrows, FaRocket, FaSmile, FaStar,} from "react-icons/fa";
import { useSelector } from 'react-redux';
import { ProjectState } from '../store';
import * as client from "../User/client";
import axios from "axios";
axios.defaults.withCredentials = true;


function Home() {
  const [brews, setBrews] = useState<any[]>([]);
  const [limitedBrews, setLimits] = useState<any[]>([]);
  const [likeBrews, setLRanks] = useState([]);
  
  const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
  
  
  const fetchBrews = async () => {
    try {
      const breweries = await admin.findAllBrews();
      const likeRankings = await admin.sortBrewByLikes(5); 
      setBrews(breweries);
      setLimits(breweries.slice(0,10))
      setLRanks(likeRankings)
    } catch (error: any) {
      console.error(error.response.data);
    }
  };
  
  const updateLikes = (brew : any) =>{
    if (!currentUser) {
      alert('You are not authorized !')
      return
    }
    const newBrew = {...brew, likes : brew.likes + 1};
    const newBrews = limitedBrews.map((i:any)=> i._id === brew._id? newBrew : i);
    admin.updateBrew(brew._id, newBrew).then((status) => setLimits(newBrews));
    admin.sortBrewByLikes(5).then((data) => setLRanks(data)) // small bug
  }
  
  const updateFollowers = (brew : any) => {
    if (!currentUser) {
      alert('You are not authorized !')
      return
    }
    const newBrew = {...brew, followers : brew.followers + 1};
    const newBrews = limitedBrews.map((i:any)=> i._id === brew._id? newBrew : i);
    admin.updateBrew(brew._id, newBrew).then((status) => setLimits(newBrews));
  }
  
  const [review, setReview] = useState({userId : "", comments: ""})
  const [currentID, setCurrent] = useState(" ")

  const updateReviews = async (brew: any, currentComment : any) =>{
    const reviewedBrew = brews.find((i :any) => i._id === brew._id)
    const newReview = [...reviewedBrew.reviews, currentComment]
    const newBrew = {...brew, reviews : newReview}
    const newBrews = limitedBrews.map((i:any)=> i._id === brew._id? newBrew : i);
    admin.updateBrew(brew._id, newBrew).then((status) => setLimits(newBrews));
    setCurrent(" ")
  }

  const getLikeBrews = (num : Number) => {
    admin.sortBrewByLikes(num).then((brews) => setLimits(brews));    
  }
  
  const getFollowBrews =  (num : Number) => {
    admin.sortBrewByFollowers(num).then((brews) => setLimits(brews));    
  }
  
  const getRandomBrews = (num : Number) => {
    admin.findRandomBrews(num).then((brews) => setLimits(brews));    
  }

  const [usr, setUsr] = useState({username : " "})
  const findUsr = (id : any) => {
    client.findUserById(id).then((data) => setUsr(data))
  }

  useEffect(() => {
    fetchBrews();
  }, []);
  
  return (
    <>
    <div className='mt-2 row mx-4'>
        <div className='col text-start text-primary my-3 fs-2' > Trending Board</div>
        <div className="col d-flex justify-content-end p-3 ">
            <button className="btn btn-light me-2 " type="button"
            > Next page </button>
            <button className="dropdown btn btn-danger me-2 dropdown-toggle" type="button"
                    id="dd" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Other Breweries 
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a className="dropdown-item btn" onClick={() => getLikeBrews(10)}>Top 10 Likes</a>
                <a className="dropdown-item btn" onClick={() => getFollowBrews(10)}>Top 10 Followers</a>
                <a className="dropdown-item btn" onClick={() => getRandomBrews(10)}>Random 10</a>
            </div>
            <button 
              className={currentUser && currentUser.role === "ADMIN"? "btn btn-secondary me-2 " : "d-none"}
              type="button">Settings </button>
        </div>   
    </div>
    <div className='d-flex mx-4'>
      <ul className="list-group rounded-5 col-2 "> 
          {likeBrews && likeBrews.map((rank: any, index) => ( 
          <li key= {index} className="list-group-item d-flex row" >
              <div className=' col-3 text-danger fs-2'>
                {index +1}  
              </div>
              <div className='col-9 text-primary'>
                {rank.name}
                <div className=' text-success'>
                  Type : {rank.brewery_type}
                </div>
                <div className='col text-danger'>
                  <FaRocket className= "me-3 text-danger "/>
                      Likes : {rank.likes}
                </div>
              </div>
                
          </li>
          ))}
      </ul>
      <ul className="list-group rounded-5 col-10 flex-grow-1 ps-5"> 
          {limitedBrews && limitedBrews.map((br: any, index : number) => 
          ( 
            <li className="list-group-item " >
                <div className='row d-flex flex-grow-1'>
                  <div className='col-3 text-primary fs-5'>
                      <FaEarlybirds/> Brewery <br></br>{br.name}
                  </div>
                  <div className='col-1 text-success'>
                      Type : {br.brewery_type}
                  </div>
                  <div className='col-2 text-primary'>
                      Beer Type:  
                      {br.beer_types && br.beer_types.map((cm : any) => <li className='ms-4'> <strong>{cm}</strong> </li>)} 
                  </div>
                  <div className='col-4'>
                    Tel : {br.phone}<br></br>
                    <ul>
                      {br.address && Object.entries(br.address).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value as React.ReactNode}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className='col-2'>
                          <button onClick={() => updateLikes(br)}
                              className= "mb-2 btn btn-sm btn-warning form-control">
                                <FaStar/> like : {br.likes} 
                            </button> <br></br>
                            <button onClick={() => updateFollowers(br)}
                              className= "btn btn-sm btn-primary form-control">
                                <FaPeopleArrows/> follow : {br.followers}
                            </button>
                            <button onClick={() => setCurrent(br._id)}
                              className={currentUser? "btn btn-sm btn-secondary float-end my-2" : "d-none"}>
                                Add Comment
                            </button>
                            <textarea placeholder='add comments....' value={review.comments} 
                              className={br._id == currentID? "border form-control" : "d-none"}
                              onChange={(e) => setReview({userId : currentUser._id, comments: e.target.value})}
                            />
                            <button onClick={() => updateReviews(br, review)}
                              className={br._id == currentID? "btn btn-sm btn-success float-end my-2" : "d-none"}>
                                Submit
                            </button>
                  </div>   
                </div>
                {br.reviews && br.reviews.map((cm : any) => {
                  if(cm.comments) {
                  //   findUsr(cm.userId)}
                    return (
                      <span className='py-2 text-warning me-2 p-2'><FaSmile/> {cm.comments} @ {usr.username}</span>
                    );}})   
                    }       
            </li>))
            }  
      </ul>
    </div>
    </>

  );
}
export default Home;


