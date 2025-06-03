import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';

// Global $apiFetch tipi için
// FetchError tipini de import etmek gerekebilir: import type { FetchError } from 'ofetch';
type $ApiFetchGlobalType = <T = any, R extends NitroFetchRequest = NitroFetchRequest> (
  request: R,
  opts?: NitroFetchOptions<R, any>
) => Promise<T>; 

export default defineNuxtPlugin(() => {
  const token = useCookie('token')
  const refreshToken = useCookie('refresh_token')
  const config = useRuntimeConfig()

  const baseURL = config.public.apiBaseUrl

  // Public routes that don't need token check
  const publicRoutes = ['/auth/login', '/auth/refresh']

  const apiFetch = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const headers = new Headers(options.headers || {});
      headers.set('Content-Type', 'application/json');
      if (token.value) {
        headers.set('Authorization', `Bearer ${token.value}`);
      }
      options.headers = headers;
    },
    async onResponseError({ request, response, options }) {
      // response.url, tam URL'yi içerir (örn: http://localhost:5000/api/auth/login)
      // publicRoutes ise path sonlarını içerir (örn: /auth/login)
      const isPublicRoute = publicRoutes.some(publicPath => response.url.endsWith(publicPath));

      if (response.status === 401 && !isPublicRoute) {
        if (!refreshToken.value) {
          token.value = null;
          if (process.client) useRouter().push('/login');
          throw new Error('No refresh token available and current token expired.');
        }
        try {
          const result = await $fetch<{ access_token: string }>('/auth/refresh', {
            baseURL, // Temel $fetch kullanıldığı için baseURL tekrar belirtilmeli
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Authorization header yok
            body: { refresh_token: refreshToken.value },
          });

          if (result.access_token) {
            token.value = result.access_token;
            // Orijinal isteği yeni token ile tekrar dene
            // options.headers burada zaten onRequest içinde tekrar ayarlanacak
            // bu yüzden sadece isteği tekrar gönderiyoruz.
            // @ts-ignore
            return $fetch(request, options as any); 
          }
          else {
            throw new Error('Invalid refresh token response');
          }
        }
        catch (refreshError) {
          token.value = null;
          refreshToken.value = null;
          if (process.client) useRouter().push('/login');
          console.error('Token refresh failed, redirecting to login:', refreshError);
          throw new Error('Session expired or refresh failed. Please login again.');
        }
      }
      throw response._data || response; // Diğer hatalar için
    },
  }) as $ApiFetchGlobalType;

  return {
    provide: {
      apiFetch: apiFetch, // Provide as $apiFetch
    },
  }
});

declare module '#app' {
  interface NuxtApp {
    $apiFetch: $ApiFetchGlobalType
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apiFetch: $ApiFetchGlobalType
  }
}

