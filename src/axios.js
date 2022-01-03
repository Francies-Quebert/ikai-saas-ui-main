import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_PATH_LIVE
      : process.env.REACT_APP_API_PATH_DEV,
  headers: { "Content-Type": "application/json" },
  timeout: 30000
});

export default instance;
