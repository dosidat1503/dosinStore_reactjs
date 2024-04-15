import axios from 'axios';

const request = axios.create({
    baseURL:"https://dosin-store.vercel.app/",
    headers:{
        "Content-Type":"application/json"
    }
})

export const get = async(path) => {
    const response = await request.get(path);
    return response.data;
}

// export const post = async(path) => {
//     const response = await request.post(path);
//     return response.data;
// }

export default request;