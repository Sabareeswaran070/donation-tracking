import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api"
});

// Helper for creating a donation
export const createDonation = (data) => API.post('/donations', data);

// Helper for deleting a donation by id
export const deleteDonation = (id) => API.delete(`/donations/${id}`);

export default API;
