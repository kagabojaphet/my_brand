const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function req(path, options = {}) {
  const token = localStorage.getItem("admin_token");
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  // Auth
  login: (email, password) => req("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => req("/auth/logout", { method: "POST" }),
  me: () => req("/auth/me"),
  changePassword: (body) => req("/auth/change-password", { method: "POST", body: JSON.stringify(body) }),

  // Analytics
  overview: (range = "30d") => req(`/analytics/overview?range=${range}`),
  timeseries: (range = "30d") => req(`/analytics/timeseries?range=${range}`),
  pages: (range = "30d") => req(`/analytics/pages?range=${range}`),

  // Visitors
  visitors: (params = {}) => req(`/visitors?${new URLSearchParams(params)}`),
  visitorSummary: (range = "7d") => req(`/visitors/summary?range=${range}`),

  // Stats
  realtime: () => req("/stats/realtime"),
  geo: () => req("/stats/geo"),
  hourly: () => req("/stats/hourly"),

  // Contact
  messages: (params = {}) => req(`/contact?${new URLSearchParams(params)}`),
  updateMessageStatus: (id, status) => req(`/contact/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteMessage: (id) => req(`/contact/${id}`, { method: "DELETE" }),

  // Brand
  getBrand: () => req("/brand"),
  updateBrand: (body) => req("/brand", { method: "PUT", body: JSON.stringify(body) }),

  // Performance
  perfSummary: (range = "7d") => req(`/performance/summary?range=${range}`),

  // Track (public)
  trackVisit: (body) => req("/visitors/track", { method: "POST", body: JSON.stringify(body) }),
  trackPageView: (body) => req("/analytics/pageview", { method: "POST", body: JSON.stringify(body) }),
  trackPerf: (body) => req("/performance", { method: "POST", body: JSON.stringify(body) }),
};
