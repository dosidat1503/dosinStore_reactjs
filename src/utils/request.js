import axios from 'axios';

const request = axios.create({
    baseURL:"http://localhost:8000/",
    headers:{
        "Content-Type":"application/json"
    }
})

request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export const get = async(path) => {
    const response = await request.get(path);
    return response.data;
}
 

export default request;