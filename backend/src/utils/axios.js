import axios from "axios";

const createAxiosInstance = (apiToken) => {
  return axios.create({
    baseURL: "https://api.apify.com/v2",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      token: apiToken,
    },
  });
};

export default createAxiosInstance;
