// API 클라이언트 - HTTP 요청 공통 처리
import { API_BASE_URL } from '../config/api';
import { TokenStorage } from '../services/authApi';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * API 요청 공통 함수
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = TokenStorage.getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 인증 토큰이 있으면 헤더에 추가
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 응답이 JSON이 아닌 경우 처리
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorMessage = '요청을 처리하는 중 오류가 발생했습니다.';
      
      if (isJson) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        errorMessage = response.statusText || errorMessage;
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };

      // 401 Unauthorized - 토큰 만료 시 리프레시 시도
      if (response.status === 401) {
        const refreshToken = TokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
              const { accessToken } = await refreshResponse.json();
              TokenStorage.setTokens(accessToken, refreshToken);
              
              // 원래 요청 재시도
              headers['Authorization'] = `Bearer ${accessToken}`;
              const retryResponse = await fetch(url, {
                ...options,
                headers,
              });

              if (!retryResponse.ok) {
                throw error;
              }

              if (isJson) {
                return await retryResponse.json();
              }
              return await retryResponse.text() as T;
            }
          } catch (refreshError) {
            // 리프레시 실패 시 로그아웃 처리
            TokenStorage.clearTokens();
            window.location.href = '/login';
            throw error;
          }
        }
      }

      throw error;
    }

    // 빈 응답 처리
    if (response.status === 204 || response.status === 201) {
      return {} as T;
    }

    if (isJson) {
      return await response.json();
    }

    return await response.text() as T;
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
      } as ApiError;
    }
    throw error;
  }
}

/**
 * GET 요청
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
  });
}

/**
 * POST 요청
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH 요청
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT 요청
 */
export async function apiPut<T>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE 요청
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

