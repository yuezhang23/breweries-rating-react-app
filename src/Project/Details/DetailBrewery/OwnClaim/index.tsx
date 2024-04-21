import { useSelector } from "react-redux";
import { ProjectState } from "../../../store";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import * as client from "./client";

export default function OwnerClaim() {

  const { detailId } = useParams();
  const { currentUser } = useSelector((state: ProjectState) => state.userReducer);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [brew, setBrew] = useState({id: "", name: "", website_url: ""});
  const [claim, setClaim] = useState({brewery_ref: "", legalName: "", additional: "", completed: false});

  const submit = async () => {
    try {
      const newClaim = await client.createClaim(claim);
      setError("")
    } catch (err: any) {
      setError(err.response.data);
    }
  }

  useEffect(() => {
    const fetchBrewery = async () => {
      const url = `https://api.openbrewerydb.org/v1/breweries/${detailId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data) {
        navigate("/SEARCH")
      }
      if (!currentUser || currentUser.role !== "OWNER") {
        alert("Register as an owner to submit the request")
        navigate("/SEARCH")
      }
      setBrew(data);
      setClaim({...claim, brewery_ref: brew.id})
      console.log(claim)
    };
    fetchBrewery();
  }, [detailId]);

  return(
    <div className="container-fluid">
      <div className="card bg-secondary text-white" style={{ height: '100px' }}>
        <div className="card-body">
          <h3 className="card-title">{brew.name}</h3>
          <p className="card-text"><strong>Website:</strong>
            <a href={brew.website_url} className="ms-1 text-decoration-none text-white" target="_blank" rel="noopener noreferrer">{brew.website_url}</a>
          </p> 
        </div>
      </div>
      {error && <div className="alert alert-danger my-1">{error}</div>}
      <label htmlFor="userLegalName" className="form-label mt-2">Legal Name: </label>
      <input
        type="text"
        className="form-control"
        value={claim.legalName}
        id="userLegalName"
        onChange={(e) => setClaim({ ...claim, legalName: e.target.value })} required/>
      <label htmlFor="userAdditional" className="form-label mt-2">Additional: </label>
      <input
        type="text"
        className="form-control"
        value={claim.additional}
        id="userLegalName"
        onChange={(e) => setClaim({ ...claim, additional: e.target.value })} required/>    
        <button onClick={submit} className="btn bg-dark-subtle form-control mt-4">
          Submit your request
        </button>
      
    </div>
  );
} 