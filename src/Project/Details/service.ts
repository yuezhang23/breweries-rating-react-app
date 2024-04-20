import axios from 'axios';


export const BREW_API = process.env.BREWERY_API_BASE;
//set as https://api.openbrewerydb.org/v1/breweries on netlify and in .env 
export const THREE_API = process.env.THREE_API_BASE;
// set as https://cafe-node-server-06d2fe9af4a2.herokuapp.com/ || http://localhost:4000

export const randomBreweryFromAPI = async () => {
  console.log('API Base URL:', BREW_API);
  const response = await axios.get(`${BREW_API}/random`)
  const local = await axios.get(`${THREE_API}/api/admin/breweries/random`)
  if (response) {
    return response.data[0];
  } else {
    return local.data;
  }
}


export const getAllBreweries = async () => {
  const response = await axios.get(`${BREW_API}`);
  const local = await axios.get(`${THREE_API}/api/admin/breweries`);
  if (response) {
    return response.data;
  } else {
    return local.data;
  }
}




