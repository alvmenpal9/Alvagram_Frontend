import axios from "axios";
import { Global_URL_API } from "../constants/Global";
const BASE_URL = Global_URL_API;

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})