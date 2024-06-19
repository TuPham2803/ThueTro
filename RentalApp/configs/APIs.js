import axios from "axios";
import { SERVER_HOST, SERVER_PORT } from "@env";

const BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;
console.log(BASE_URL);
console.log(BASE_URL);
console.log(BASE_URL);
console.log(BASE_URL);

export const endpoints = {
  post_accommodations: "/post_accommodations/",
  post_accommodation_details: (postAccommodationId) =>
    `/post_accommodations/${postAccommodationId}/`,
  post_requests: "/post_requests/",
  post_request_details: (postRequestId) => `/post_requests/${postRequestId}/`,
  user: "/user/",
  "user-details": (userId) => `/user/?id=${userId}`,
  "current-user": "/user/current-user/",
  login: "/o/token/",
  register: "/user/",
  comments: (postId) => `/post_accommodations/${postId}/comments/`,
  update_profile: "/user/current-user/",
  update_password: "/user/update-password/",
  like: (postId) => `/post_accommodations/${postId}/like/`,
  check_liked: (postId) => `/post_accommodations/${postId}/check_liked/`,
};

export const authApi = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
});
