import axios from 'axios';
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
