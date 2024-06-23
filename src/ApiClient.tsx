import axios from "axios";
import { Constants } from "./constants";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export default class ApiClient {
  async request<T>(options: any) {
    return axios.request<T>({
      method: options.method,
      url: BASE_API_URL + "/api" + options.url,
      params: new URLSearchParams(options.query),
      headers: {
        ...(localStorage.getItem(Constants.TOKEN) && {
          Authorization: "Bearer " + localStorage.getItem(Constants.TOKEN),
        }),
        ...options.headers,
      },
      data: options.body,
      signal: options.signal,
    });
  }

  async get<T>(url: string, query: any = {}, options: any = {}) {
    return this.request<T>({ method: "get", url, query, ...options });
  }

  async post<T>(url: string, body: any, options: any = {}) {
    return this.request<T>({ method: "post", url, body, ...options });
  }

  async put<T>(url: string, body: any, options: any = {}) {
    return this.request<T>({ method: "put", url, body, ...options });
  }

  async delete<T>(url: string, options: any = {}) {
    return this.request<T>({ method: "delete", url, ...options });
  }
}
