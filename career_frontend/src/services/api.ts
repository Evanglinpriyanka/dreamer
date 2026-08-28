import type { AuthResponse, AuthUser, CareerRecommendation, Roadmap, UserProfile } from "@/types/api";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) throw new ApiError(0, "Backend API URL is not configured.");

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { detail?: string; message?: string };
      message = body.detail ?? body.message ?? message;
    } catch {
      // Some error responses have no JSON body.
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const authApi = {
  signIn: (payload: { email: string; password: string }) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  signUp: (payload: { name: string; email: string; password: string }) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  currentUser: () => request<AuthUser>("/auth/me"),
};

export const profileApi = {
  get: () => request<UserProfile>("/profile"),
  update: (payload: Partial<UserProfile>) => request<UserProfile>("/profile", { method: "PUT", body: JSON.stringify(payload) }),
};

export const careerApi = {
  recommendations: () => request<CareerRecommendation[]>("/recommendations"),
  details: (careerId: string) => request<CareerRecommendation>(`/career/${encodeURIComponent(careerId)}`),
  saveAssessment: (payload: unknown) => request<void>("/assessment", { method: "POST", body: JSON.stringify(payload) }),
};

export const roadmapApi = {
  get: (careerId: string) => request<Roadmap>(`/roadmap/${encodeURIComponent(careerId)}`),
  updateProgress: (stepId: string, status: string) => request<void>(`/roadmap/${encodeURIComponent(stepId)}/progress`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
