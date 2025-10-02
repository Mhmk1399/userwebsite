import ApiService from "./api-service";

interface ServiceConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  endpoints?: Record<string, string>;
}

export function createApiService(config: ServiceConfig = {}) {
  const service = new ApiService(config);

  return {
    // Direct methods
    get: service.get.bind(service),
    post: service.post.bind(service),
    patch: service.patch.bind(service),
    delete: service.delete.bind(service),

    // Dynamic endpoint builder
    endpoint: (path: string) => ({
      get: (options?: Record<string, unknown>) => service.get(path, options),
      post: (body?: Record<string, unknown>, options?: Record<string, unknown>) => service.post(path, body, options),
      patch: (body?: Record<string, unknown>, options?: Record<string, unknown>) => service.patch(path, body, options),
      delete: (options?: Record<string, unknown>) => service.delete(path, options),
    }),

    // Predefined endpoints (if configured)
    ...(config.endpoints &&
      Object.keys(config.endpoints).reduce((acc, key) => {
        const path = config.endpoints![key];
        acc[key] = {
          get: (options?: Record<string, unknown>) => service.get(path, options),
          post: (body?: Record<string, unknown>, options?: Record<string, unknown>) =>
            service.post(path, body, options),
          patch: (body?: Record<string, unknown>, options?: Record<string, unknown>) =>
            service.patch(path, body, options),
          delete: (options?: Record<string, unknown>) => service.delete(path, options),
        };
        return acc;
      }, {} as Record<string, unknown>)),
  };
}

export default createApiService;
