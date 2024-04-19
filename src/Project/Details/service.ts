import axios from 'axios';
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const BREW_API = `${BASE_API}/api/breweries`;

export const randomBreweryFromAPI = async () => {
  console.log('BREW API URL:', BREW_API);
  const response = await axios.get(`${BREW_API}/random`)
  return response.data;
}

