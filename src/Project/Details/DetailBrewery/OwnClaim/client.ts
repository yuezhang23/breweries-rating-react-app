import axios from 'axios';
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const CLAIM_API = `${BASE_API}/api/claims`;
export const USERS_API = `${BASE_API}/api/users`;

export interface Claim { _id: string; brewery_url: string; owner: string; addition?: string, completed?:boolean, approved?:boolean};

export const createClaim = async (claim: any) => {
  const response = await axios.post(`${CLAIM_API}`, claim);
  return response.data;
};

export const findAllClaims = async() =>{
  const response = await axios.get(`${CLAIM_API}`);
  return response.data;
}

export const findPendingClaims = async(userId: any) =>{
  const response = await axios.get(`${USERS_API}/${userId}/claims/pending`);
  return response.data;
}