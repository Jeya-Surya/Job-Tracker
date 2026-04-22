const BASE_URL = "http://localhost:8080/api";

const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
    };
};

const handleResponse = async (res) => {
    const text = await res.text();
    let data;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = {message: text};
    }

    if (!res.ok) {
        throw new Error(data?.message || "Something went wrong!");
    }

    return data;
};

const api = {
    get: (url) =>
        fetch(`${BASE_URL}${url}`, {
            headers: getHeaders(),
        }).then(handleResponse),

    post: (url, data) =>
        fetch(`${BASE_URL}${url}`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        }).then(handleResponse),

    put: (url, data) =>
        fetch(`${BASE_URL}${url}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        }).then(handleResponse),

    delete: (url) =>
        fetch(`${BASE_URL}${url}`, {
            method: "DELETE",
            headers: getHeaders(),
        }).then(handleResponse),
};

export default api;