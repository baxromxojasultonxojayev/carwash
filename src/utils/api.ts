import axios from "./axios";

interface FetchOptions {
  url: string;
  method?: "get" | "post" | "put" | "delete";
  data?: any;
  params?: any;
  headers?: any;
}

export const loadData = async ({
  url,
  method = "get",
  data = null,
  params = {},
  headers = {},
}: FetchOptions) => {
  const token = localStorage.getItem("token");

  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, ...headers }
    : headers;

  const res = await axios.request({
    url,
    method,
    data,
    params,
    headers: authHeaders,
  });

  return res.data;
};
