import { useEffect, useState } from "react";
import * as service from "./service";

import axios from "axios";
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
    latitude: "",
    longitude: "", 
    postalCode: "", 
  });

  const fetchBrew = async () => {
    try {
      const brewery = await service.randomBreweryFromAPI();
      setBrew(brewery);
    } catch (err: any) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    fetchBrew();
  }, []);
  
  return (
    <div className="container-fluid">
      <h3>Explore A Random Brewery {brew.name}</h3>


    </div>
  );
}

export default Details;