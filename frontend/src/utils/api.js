import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/'
    // withCredentials: true,
    // headers: {"Access-Control-Allow-Origin": "*"}
  });

  export default api;