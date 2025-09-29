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
    useGet: service.useGet.bind(service),

    // Dynamic endpoint builder
    endpoint: (path: string) => ({
      get: (options?: any) => service.get(path, options),
      post: (body?: any, options?: any) => service.post(path, body, options),
      patch: (body?: any, options?: any) => service.patch(path, body, options),
      delete: (options?: any) => service.delete(path, options),
      useGet: (options?: any) => service.useGet(path, options),
    }),

    // Predefined endpoints (if configured)
    ...(config.endpoints &&
      Object.keys(config.endpoints).reduce((acc, key) => {
        const path = config.endpoints![key];
        acc[key] = {
          get: (options?: any) => service.get(path, options),
          post: (body?: any, options?: any) =>
            service.post(path, body, options),
          patch: (body?: any, options?: any) =>
            service.patch(path, body, options),
          delete: (options?: any) => service.delete(path, options),
          useGet: (options?: any) => service.useGet(path, options),
        };
        return acc;
      }, {} as any)),
  };
}

export default createApiService;
