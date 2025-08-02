import api from "./axiosInstance";

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);
export const refreshToken = (data) => api.post("/auth/refresh-token", data);
export const logout = (data) => api.post("/auth/logout", data);
export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
