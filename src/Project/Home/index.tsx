import React, { useEffect, useState } from 'react';
import * as admin from './home';
import * as service from '../Details/service';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectState } from '../store';
import axios from "axios";
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import UsrHome from './user';
import GuestHome from './guest';
import AdminHome from './admin';
import {setBrews } from '../Home/brewReducer'
import { FaRocket } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
axios.defaults.withCredentials = true;


function Home() {
  const {currentUser} = useSelector((state: ProjectState) => state.userReducer)
  const {pathname} = useLocation()
  const {currentBrews} = useSelector((state: ProjectState) => state.brewReducer)
  const [done, setDone] = useState(false)
  const [val, setVal] = useState("likes")
  const [ranks, setRanks] = useState([]);
  const dispatch = useDispatch();


  const fetchBrews = async () => {
    try {
      admin.findAllBrews().then((data) => dispatch(setBrews(data)))
    } catch (error: any) {
      console.error(error.response.data);
    }
  };


  const fetchRankings = async () => {
    if (!done) {
      const rankings = await admin.sortBrewByLikes(5); 
      setRanks(rankings)
      setVal('likes')
    }
    else {
      const rankings = await admin.sortBrewByFollowers(5); 
      setRanks(rankings)
      setVal('follows')
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
  
  
  
  const greetings = async () => {
    if (!currentUser) {
      toast.info(
        <span>Hey, <strong className='text-danger'>  Guest </strong>! Have fun here!</span>, {icon: false})
    }
    else if (currentUser.role === 'ADMIN') {
      toast.info(
        <span>Hey, <strong className='text-danger'> {currentUser.firstName}</strong>! Happy to have you!</span>, {icon: false})
      }
      else if (currentUser.role === 'USER') {
        toast.info(
          <span>Hey, <strong className='text-danger'> {currentUser.firstName}</strong>! Have fun here!</span>, {icon: false})
        }
        else {
          toast.info(
          <span>Hey, <strong className='text-danger'> {currentUser.firstName}</strong>! Claim your breweries here!</span>, {icon: false})
    }
  }
  
  useEffect(() => {
    fetchBrews();
  }, []);
  
  
  useEffect(() => {
    fetchRankings()
  }, [done, currentBrews]);
  
  useEffect(() => {
    addOwnerBrews()
    greetings()
  }, []);



  return (
    <div className='d-flex mx-2'>
      <div className='col-3 d-none d-lg-block'>
        <button className='btn bg-success-subtle text-primary btn-sm' onClick={() => setDone(!done)}> <strong>SWITCH</strong> </button>
        <span className='text-middle'>
        <ToastContainer  autoClose={1000} position="top-center" hideProgressBar={true} closeButton={false}
        toastStyle={{color: '#FF7F50', whiteSpace:'nowrap', width: '500px'}}/>
        </span>
        <ul className="list-group flex-grow-1"> 
            <span className='text-start text-primary fs-3 ms-2' > Today's Top <strong className='text-danger'>{val}</strong></span>
            <br></br>
            {ranks && ranks.map((rank: any, index : number) => ( 
            <li key= {index} 
                className={ "list-group-item d-flex row mx-2 rounded-2"} >
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
                        {val} : {val === 'likes' && rank.likeCount}{val === 'follows' && rank.followCount}
                    </div>
                </div>
                    
            </li> 
            ))}
        </ul>
      </div>
      <div className="col-9 flex-grow-1 my-5 ">
          <Routes>
              <Route path="/" element={<Navigate to="Guest"/>} />
              <Route path="Guest" element={<GuestHome/>} />
              <Route path="User" element={<GuestHome/>} />
              <Route path="User/:usrId" element={<UsrHome/>} />
              <Route path="Admin/*" element={<AdminHome/>} />
          </Routes>
      </div>
    </div>
  );
}
export default Home;