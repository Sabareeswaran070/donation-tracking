import axios from "axios";

const API = axios.create({
  baseURL: "https://donation-tracking.onrender.com/api"
});

export const createDonation = (data) => API.post("/donations", data);
export const deleteDonation = (id) => API.delete(`/donations/${id}`);
export default API;
