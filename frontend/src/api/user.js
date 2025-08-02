import api from "./axiosInstance";

export const getUsers = (search = "", page = 1, limit = 10) =>
  api.get(`/users?search=${search}&page=${page}&limit=${limit}`);

export const getProfile = () => api.get("/users/profile");

export const updateProfile = (formData) =>
  api.put("/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
