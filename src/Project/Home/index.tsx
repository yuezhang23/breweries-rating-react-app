import React, { useEffect, useState } from 'react';
import * as admin from './admin';
import {FaChevronCircleRight, FaChevronRight, FaCircle, FaEarlybirds, FaPeopleArrows, FaRocket, FaSdCard, FaSmile, FaSnowflake, FaStar,} from "react-icons/fa";
import { BsSuitDiamond } from 'react-icons/bs';


function Home() {
  const [brews, setBrews] = useState([]);
  const [brew, setBrew] = useState({});
  const [ranks, setRanks] = useState([]);
  const [likes, setLikes] = useState([]);
  const [followers, setFollowers] = useState([]);

  const fetchBrews = async () => {
    try {
      const breweries = await admin.findAllBrews();
      const likeRankings = await admin.sortBrewByLikes(10);
      setBrews(breweries);
      setRanks(likeRankings)
    } catch (error: any) {
      console.error(error.response.data);
    }
  };

  const updateLikes = (brew : any) => {
    const newLike = brew.likes + 1;
    setBrew({...brew, likes : newLike})
  }


  useEffect(() => {
    fetchBrews();
  }, []);

  return (
    <>
    <span className='mx-4 d-flex'>
      <h2 className='ms-4 text-primary my-3'> Trending Board</h2>
      {/* <button className='btn btn-danger justify-content-end my-2 me-2'> Sort </button>
      <button className='btn btn-success justify-content-center my-2'> Filter </button> */}
    </span>
    <div className='d-flex'>
    <ul className="list-group rounded-5 col-2 mx-4"> 
        {ranks && ranks.map((rank: any, index) => ( 
        <li key= {index} className="list-group-item d-flex row" >
            <div className=' col-3 text-danger fs-2'>
              {10 - index}  
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
    <ul className="list-group rounded-5 col-10 flex-grow-1 mx-2"> 
        {brews && brews.map((brew: any) => ( 
        <li className="list-group-item " >
            <div className='row d-flex flex-grow-1'>
              <div className='col-3 text-primary fs-5'>
                  <FaEarlybirds/> {brew.name}<br></br>
              </div>
              <div className='col-2 text-success'>
                  Type : {brew.brewery_type}
              </div>
              <div className='col-2 text-danger'>
                  Beer Type:  {brew.beer_types}
              </div>
              <div className='col-2'>
                    Tel : {brew.phone}<br></br>
                    {/* Address : {JSON.stringify(brew.address, null,2)} */}
              </div>
              <div className='col-2 form'>
                       <button onClick={() => updateLikes(brew)}
                          className= "mb-2 btn btn-sm btn-warning form-control">
                            <FaStar/> like : {brew.likes} 
                        </button> <br></br>
                        <button 
                          className= "btn btn-sm btn-primary form-control">
                            <FaPeopleArrows/> follow : {brew.followers}
                        </button>
              </div>   
            </div>
              {brew.reviews && brew.reviews.map((cm : any) => <span className='text-warning me-2 p-2'><FaSmile/> {cm.comments[0]}</span>)} 
        </li>
        ))}
    </ul>

    </div>
    </>

  );
}
export default Home;


