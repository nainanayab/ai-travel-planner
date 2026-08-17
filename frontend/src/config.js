const configuredBackendUrl = import.meta.env.VITE_API_URL?.trim();

export const BACKEND_URL =
  configuredBackendUrl ||
  (import.meta.env.PROD
    ? "https://ai-travel-planner-ri7n.onrender.com"
    : "http://127.0.0.1:8000");