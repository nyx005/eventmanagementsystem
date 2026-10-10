import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthForm = url.includes("/auth/login") || url.includes("/auth/register");
    if (err.response?.status === 401 && !isAuthForm) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const errorMessage = (err) =>
  err.response?.data?.message || err.message || "Something went wrong";

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const fetchMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);

export const fetchEvents = (params) => api.get("/events", { params });
export const fetchMyEvents = () => api.get("/events/mine");
export const fetchEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post("/events", data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

export const joinEvent = (id) => api.post(`/events/${id}/registrations`);
export const cancelEvent = (id) => api.delete(`/events/${id}/registrations`);
export const fetchEventRegistrations = (id) =>
  api.get(`/events/${id}/registrations`);
export const fetchMyRegistrations = () => api.get("/registrations/mine");

export default api;