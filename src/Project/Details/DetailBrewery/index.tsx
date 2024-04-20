import { useLocation, useParams } from "react-router";
import GoogleComponent from "../GoogleComponent";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProjectState } from "../../store";

export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  phone: string;
  website_url: string;
  city: string;
  state: string;
  country: string;
  address_1: string;
  latitude: string;
  longitude: string;
}

function DetailBrewery() {
  const { detailId } = useParams<{ detailId: string }>();
  const [brew, setBrew] = useState<Brewery | null>(null);
  const { currentUser } = useSelector((state: ProjectState) => state.userReducer);


  useEffect(() => {
    const fetchBrewery = async () => {
      const url = `https://api.openbrewerydb.org/v1/breweries/${detailId}`;
      const response = await fetch(url);
      const data = await response.json();
      setBrew(data);
    };

    fetchBrewery();
  }, [detailId]);
  
  if (!brew) 
    { return <div>Loading brewery details...</div>; }
  
  return (
    <div className="container-fluid">
      <div className="row mb-2">
        {currentUser && (currentUser.role ==="OWNER") && 
          <div className="float-end"><Link to={`/Details/${detailId}/claim`} className="btn bg-warning-subtle float-end">+ Claim as Owner Request</Link></div>}
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card bg-secondary text-white" style={{ height: '400px' }}>
            <div className="card-body">
              <h3 className="card-title">{brew.name}</h3>
              <p className="card-text"><strong>Type:</strong> {brew.brewery_type}</p>
              <p className="card-text"><strong>Phone:</strong> {brew.phone}</p>
              <p className="card-text"><strong>Website:</strong>
                <a href={brew.website_url} className="ms-1 text-decoration-none text-white" target="_blank" rel="noopener noreferrer">{brew.website_url}</a>
              </p>
              <p className="card-text"><strong>Address:</strong> {`${brew.address_1}, ${brew.city}, ${brew.state}, ${brew.country}`}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
        {(!brew.latitude || !brew.longitude) ?  
            <>No Map Info</> :
            <GoogleComponent center={{ lat: parseFloat(brew.latitude), lng: parseFloat(brew.longitude) }}/> 
          }
        </div>
      </div>
    </div>
  );
}

export default DetailBrewery;