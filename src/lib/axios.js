import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://renokon-backend.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// https://renokon-backend.onrender.com/api/v1   http://localhost:5000/api/v1
