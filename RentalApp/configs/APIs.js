import axios from "axios";

const BASE_URL = "http://26.14.198.86:8000/";

export const endpoints = {
  post_accomodations: "/post_accommodations/",
  post_requests: "/post_requests/",
  user: "/user/",
  "current-user": "/user/current-user/",
  login: "/o/token/",
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
