import api from "./apiConfig.js"

export const getDashboardStats = () => api.get("/analytics/dashboard");
export const getWeeklyStats = () => api.get("/analytics/weekly");