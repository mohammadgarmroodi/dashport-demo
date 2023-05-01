import { githubConfig } from './../config';
import axios from "axios";

const clientInstance = axios.create({
  baseURL: "",
});

const serverInstance = axios.create({
  baseURL: githubConfig.server_url,
  withCredentials:true
});

export { clientInstance ,serverInstance};
