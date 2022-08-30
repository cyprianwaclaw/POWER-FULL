import axios from "axios";
import { parseCookies } from "nookies";
const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${parseCookies()["access_token"]}`,
  },
});

export { axiosInstance };
export default axiosInstance;
