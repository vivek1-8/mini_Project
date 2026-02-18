import axios from "axios";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/* -------------------- CLASSNAME UTILITY -------------------- */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/* -------------------- AXIOS INSTANCE -------------------- */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* -------------------- REGISTER API -------------------- */
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error.response?.data || error.message);
    throw error;
  }
};

/* -------------------- LOGIN API -------------------- */
export const loginUser = async (userData) => {
  try {
    const response = await API.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};
