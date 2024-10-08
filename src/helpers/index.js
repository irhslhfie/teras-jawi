import axios from "axios";
export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URI}`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") && JSON.parse(localStorage.getItem("token"));
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["ngrok-skip-browser-warning"] = "69420"
        // console.log(config.headers);
    }
    return config;
});