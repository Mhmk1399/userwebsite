import useSWR from "swr";

interface ApiConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  cache?: number;
}

interface RequestOptions extends ApiConfig {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || "";
    this.defaultHeaders = config.headers || {};
  }

  private async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...options.headers };

    const config: RequestInit = {
      method: options.method || "GET",
      headers,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
      headers["Content-Type"] =
        "Content-Type" in headers
          ? headers["Content-Type"]
          : "application/json";
    }

    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  get(endpoint: string, options: ApiConfig = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint: string, body?: any, options: ApiConfig = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  }

  patch(endpoint: string, body?: any, options: ApiConfig = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", body });
  }

  delete(endpoint: string, options: ApiConfig = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }

  useGet(
    endpoint: string,
    options: ApiConfig & { revalidateOnFocus?: boolean } = {}
  ) {
    const {
      cache = 60000,
      revalidateOnFocus = false,
      ...fetchOptions
    } = options;

    return useSWR(endpoint, () => this.get(endpoint, fetchOptions), {
      refreshInterval: cache,
      revalidateOnFocus,
    });
  }
}

export default ApiService;
