import React, { useEffect, useState } from 'react';
import * as service from './service';
import GoogleComponent from './GoogleComponent';
import axios from 'axios';

axios.defaults.withCredentials = true;

function Details() {
  const [brew, setBrew] = useState({
    id: "",
    name: "",
    brewery_type: "",
    phone: "",
    website_url: "",
    city: "",
    state: "",
    country: "",
    latitude: null,
    longitude: null
  });

  const [isNull, setIsNull] = useState(false)

  const fetchBrew = async () => {
    try {
      const brewery = await service.randomBreweryFromAPI();
      setBrew({
        ...brewery,
        latitude: parseFloat(brewery.latitude),
        longitude: parseFloat(brewery.longitude)
      });
    } catch (error: any) {
      console.error(error.response.data);
    }
  };

  const nullValue = () => {
    if (brew.latitude === null || brew.longitude === null) {
      setIsNull(true);
    }
  }

  useEffect(() => {
    fetchBrew();
    nullValue();
  }, []);

  return (
    <div className="container-fluid">
      <div className="ms-2">
        <h1>Explore A Random Brewery</h1>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card bg-secondary text-white" style={{"height": "400px"}}>
            <div className="card-body">
              <h3 className="card-title">{brew.name}</h3>
              <p className="card-text"><strong>Type:</strong> {brew.brewery_type}</p>
              <p className="card-text"><strong>Phone:</strong> {brew.phone}</p>
              <p className="card-text"><strong>Website:</strong>
                <a href={brew.website_url} className="ms-1 text-decoration-none text-white" target="_blank" rel="noopener noreferrer">{brew.website_url}</a>
              </p>
              <p className="card-text"><strong>Address:</strong> {`${brew.city}, ${brew.state}, ${brew.country}`}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
        {(isNull) ? (
          <div>No Map info</div>
          ):(<><GoogleComponent center={{ lat: brew.latitude, lng: brew.longitude }}/></>)}
        </div>
      </div>
    </div>
  );
}

export default Details;
