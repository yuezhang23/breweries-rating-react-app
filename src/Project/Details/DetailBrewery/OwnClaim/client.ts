import axios from 'axios';
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const CLAIM_API = `${BASE_API}/api/claims`;

export const createClaim = async (claim: any) => {
  const response = await axios.post(`${CLAIM_API}`, claim);
  return response.data;
};
