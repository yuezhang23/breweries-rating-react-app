import axios from 'axios';
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const BREW_API = `${BASE_API}/api/breweries`;
//set as https://api.openbrewerydb.org/v1/breweries on netlify and in .env 


export const randomBreweryFromAPI = async () => {
  console.log('API Base URL:', BREW_API);
  const response = await axios.get(`${BREW_API}/random`)
  const local = await axios.get(`${BASE_API}/api/admin/breweries/random`)
  if (response) {
    return response.data;
  } else {
    return local.data;
  }
}


export const getAllBreweries = async () => {
  const response = await axios.get(`${BREW_API}`);
  const local = await axios.get(`${BASE_API}/api/admin/breweries`);
  if (response) {
    return response.data;
  } else {
    return local.data;
  }
}




