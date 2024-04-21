import axios from "axios";
axios.defaults.withCredentials = true;

export const BASE_API = process.env.REACT_APP_API_BASE;
export const ADMIN_API = `${BASE_API}/api/admin`;


export const createBrew = async (brew: any) => {
    const response = await axios.post(`${ADMIN_API}/breweries`, brew);
    return response.data;
};

export const updateBrew = async (brewId: any, brew: any) => {
    const response = await axios.put(`${ADMIN_API}/breweries/${brewId}`, brew);
    return response.data;
};

export const deleteBrew = async (brew: any) => {
    const response = await axios.delete(
        `${ADMIN_API}/breweries/${brew._id}`);
    return response.data;
};

export const findAllBrews = async () => {
    const response = await axios.get(`${ADMIN_API}/breweries`);
    return response.data;
};

export const findBrewById = async (id: string) => {
    const response = await axios.get(`${ADMIN_API}/breweries/${id}`);
    return response.data;
};

export const sortBrewByLikes = async (count: number) => {
    const response = await axios.get(`${ADMIN_API}/breweries/likes/`+ count);
    return response.data;
};

export const sortBrewByFollowers = async (count: number) => {
    const response = await axios.get(`${ADMIN_API}/breweries/followers/`+ count);
    return response.data;
};

export const findReviewsByUserId = async (userId: string) => {
    const response = await axios.get(`${ADMIN_API}/breweries/reviews/${userId}`);
    return response.data;
};
