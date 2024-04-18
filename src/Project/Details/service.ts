import axios from 'axios';

export const BREW_API = process.env.BREWERY_API_BASE;
//set as https://api.openbrewerydb.org/v1/breweries on netlify and in .env 


export const randomBreweryFromAPI = async () => {
  console.log('API Base URL:', BREW_API);
  const response = await axios.get(`${BREW_API}/random`)
  return response.data[0];
}

