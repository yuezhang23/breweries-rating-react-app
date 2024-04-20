import axios from 'axios';
axios.defaults.withCredentials = true;

export const BASE_API_URL = process.env.REACT_APP_API_BASE;
export const FOLLOW_API = `${BASE_API_URL}/api/users/follow`;

export const followsUser = async (follows: any) => {
  const response = await axios.post(`${FOLLOW_API}/${follows}`)
  return response.data;
}

export const unfollowsUser = async (follows: any) => {
  const response = await axios.delete(`${FOLLOW_API}/${follows}`)
  return response.data;
}

export const findFollowersOfAUser = async (follows: any) => {
  const response = await axios.get(`${FOLLOW_API}/${follows}/followers`)
  return response.data;
}

export const findFollowsOfAUser = async (follower: any) => {
  const response = await axios.get(`${FOLLOW_API}/${follower}/follows`)
  return response.data;
}

export const followersNumber = async (follows: any) => {
  const response = await axios.get(`${FOLLOW_API}/${follows}/followers`)
  return response.data.length;
}

export const followsNumber = async (follower: any) => {
  const response = await axios.get(`${FOLLOW_API}/${follower}/follows`)
  return response.data.length;
}