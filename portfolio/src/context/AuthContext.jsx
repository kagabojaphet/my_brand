// src/context/AuthContext.jsx  (or src/admin/context/AuthContext.jsx)
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading,   setLoading]   = useState(true);

  // Restore session from saved token on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setLoading(false); return; }

    fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      // FIX: removed credentials:"include" — not needed for Bearer token auth
      // and it triggers CORS preflight that your server may not handle
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setUser(d.user);
        else           localStorage.removeItem("admin_token");
      })
      .catch(() => localStorage.removeItem("admin_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      // FIX: removed credentials:"include" — Bearer token auth doesn't need cookies
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success)
      throw new Error(data.message || "Login failed");

    localStorage.setItem("admin_token", data.token);
    setUser(data.user);
    setShowLogin(false);
    return data.user;
  };

  const logout = () => {
    // FIX: removed the fetch to /auth/logout — that route doesn't exist
    // in your backend. JWT auth is stateless; removing the token is enough.
    localStorage.removeItem("admin_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showLogin, setShowLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);