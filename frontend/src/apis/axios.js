import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});


const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorMsg = error.response.data?.message || "";
      const errorCode = error.response.data?.code || "";

      
      if (errorCode === "TOKEN_EXPIRED" || errorMsg.toLowerCase().includes("expired")) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          
          const response = await refreshApi.post("/auth/refresh");
          const newToken = response.data.token;

          if (newToken) {
            localStorage.setItem("token", newToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            
            processQueue(null, newToken);
            isRefreshing = false;
            
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          
          
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/auth/signin?expired=true";
          
          return Promise.reject(refreshError);
        }
      } else {
        
        
        
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/auth/")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/auth/signin";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
