import axios from "axios";
const EnviroMent = import.meta.env.VITE_ENVIRONMENT;

export const axiosInstance = axios.create({
  baseURL: EnviroMent === "development" ? "http://localhost:5000/api/v1" : "https://renokon-backend-production.up.railway.app/api/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// https://renokon-backend.onrender.com/api/v1   http://localhost:5000/api/v1
