import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Crucial for reading/writing HTTP-Only cookies
});

// A separate instance for refreshing tokens to avoid request looping
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

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorMsg = error.response.data?.message || "";
      const errorCode = error.response.data?.code || "";

      // Only attempt refresh if it is an expired token error
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
          // Trigger token refresh endpoint
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
          
          // Clear user credentials on refresh failure and redirect to signin
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/auth/signin?expired=true";
          
          return Promise.reject(refreshError);
        }
      } else {
        // If it's a 401 but not due to expired token (e.g. invalid login, not logged in)
        // Let the caller handle it directly (such as Login component showing "invalid credentials")
        // But if the route is protected, we redirect to login
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
