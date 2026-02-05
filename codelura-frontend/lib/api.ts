// import axios from "axios";
// import toast from "react-hot-toast";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//    withCredentials: true, // ⭐ VERY IMPORTANT
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// // ✅ REQUEST INTERCEPTOR – TOKEN ADD KARO
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // RESPONSE INTERCEPTOR
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       toast.error("Session expired. Please login again.");
//       localStorage.removeItem("token");
//         window.location.href = "/auth/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;

import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ⭐ COOKIE SEND KARNE KE LIYE
  headers: {
    "Content-Type": "application/json",
  },
});

// ❌ REQUEST INTERCEPTOR SE TOKEN HATA DIYA
// Cookies automatically send hongi

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      toast.error("Session expired. Please login again.");

      // ❌ localStorage clear mat karo (use hi nahi ho raha)
      // ❌ window.location direct use mat karo (Next.js)

      if (typeof window !== "undefined") {
        window.location.replace("/auth/login");
      }
    }
    return Promise.reject(err);
  }
);

export default api;
