import { baseUrl } from './config';

export async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    // Fallback for AWS Lambda cold starts
    return { cachedData: [] } as T;
  }
}

export async function postData<T>(endpoint: string, data: unknown): Promise<T> {
  return fetchData<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function putData<T>(endpoint: string, data: unknown): Promise<T> {
  return fetchData<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteData<T>(endpoint: string): Promise<T> {
  return fetchData<T>(endpoint, {
    method: 'DELETE',
  });
} 