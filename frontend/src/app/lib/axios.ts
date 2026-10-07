import axios from "axios";

/**
 * Centralized Reusable Axios Instance for JournalX Frontend
 * - Automatically attaches credentials (cookies) to all requests
 * - Pre-configures base REST API URL
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
