import api from "./apiConfig.js"

export const getAllApplications = () => api.get("/applications");
export const getApplicationById = id => api.get(`/applications/${id}`);
export const createApplication = data => api.post("/applications", data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = id => api.delete(`/applications/${id}`);