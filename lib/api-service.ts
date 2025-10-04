

interface ApiConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  cache?: number;
}

interface RequestOptions extends ApiConfig {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
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
    if (!response.ok) console.log(`HTTP ${response.status}`);
    return response.json();
  }

  get(endpoint: string, options: ApiConfig = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint: string, body?: Record<string, unknown>, options: ApiConfig = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  }

  patch(endpoint: string, body?: Record<string, unknown>, options: ApiConfig = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", body });
  }

  delete(endpoint: string, options: ApiConfig = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }


}

export default ApiService;
