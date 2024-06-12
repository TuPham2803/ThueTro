import axios from "axios";

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT+"";

const BASE_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

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
  update_profile: "/user/current-user/",
  update_password: "/user/update-password/",
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