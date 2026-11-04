import axios from "axios";

// ✅ Force it to use localhost and your local port
const Http = axios.create({
  baseURL: "http://localhost:5001", 
});

Http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem("userToken")) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("userId");
        localStorage.removeItem("serverInstanceId");
        sessionStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);

export default Http;