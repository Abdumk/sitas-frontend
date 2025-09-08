import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Signup request
export const signupUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, userData);
  return response;
};

// Login request
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, userData);
  return response;
};
