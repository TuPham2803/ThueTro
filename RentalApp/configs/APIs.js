import axios from "axios";

const BASE_URL = "http://192.168.1.4:8000/";

export const endpoints = {
  post_accomodations: "/post_accommodations/",
  post_accomodation_details: (postAccomodationId) =>
    `/post_accommodations/${postAccomodationId}/`,
  post_requests: "/post_requests/",
  post_request_details: (postRequestId) => `/post_requests/${postRequestId}/`,
  user: "/user/",
  "user-details": (userId) => `/user/?id=${userId}`,
  "current-user": "/user/current-user/",
  login: "/o/token/",
  register: "/user/",
  comments: (postId) => `/post_accommodations/${postId}/comments/`,
};

export const authApi = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
});
