import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

export function useApi() {
  const { getToken } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchWithToken = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      try {
        const token = await getToken();
        
        const headers = new Headers(options.headers);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
            headers.set("Content-Type", "application/json");
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
          ...options,
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `API error: ${response.status}`);
        }

        return response.json();
      } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
      }
    },
    [baseUrl, getToken]
  );

  return { fetchWithToken };
}
