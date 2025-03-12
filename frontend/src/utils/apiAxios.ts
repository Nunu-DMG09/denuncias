import axios from "axios";

const api = axios.create({
    baseURL: 'backend_url', // placeholder de la url del backend
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})
export default api;