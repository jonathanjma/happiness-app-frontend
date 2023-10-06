import axios from "axios";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default class ApiClient {
  async request(options: any) {
    return axios({
      method: options.method,
      url: BASE_API_URL + "/api" + options.url,
      params: new URLSearchParams(options.query),
      headers: {
        Authorization: "Bearer " + localStorage.getItem(Constants.TOKEN),
        ...options.headers,
      },
      data: options.body,
    });
  }

  async get(url: string, query: any = {}, options: any = {}) {
    return this.request({ method: "get", url, query, ...options });
  }

  async post(url: string, body: any, options: any = {}) {
    return this.request({ method: "post", url, body, ...options });
  }

  async put(url: string, body: any, options: any = {}) {
    return this.request({ method: "put", url, body, ...options });
  }

  async delete(url: string, options: any = {}) {
    return this.request({ method: "delete", url, ...options });
  }
}
