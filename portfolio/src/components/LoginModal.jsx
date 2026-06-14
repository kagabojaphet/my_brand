import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal() {
  const { showLogin, setShowLogin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.role === "admin") navigate("/admin");
    } catch (e) {
      setError(e.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showLogin && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowLogin(false)}>
          <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-md p-8 border border-neutral-200 dark:border-neutral-800 shadow-2xl">

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={18} className="text-accent" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-700">Admin Login</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Sign in to your dashboard</p>
                </div>
              </div>
              <button onClick={() => setShowLogin(false)} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="japhet@example.com" onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:border-accent transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-neutral-400 mb-2 block">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full pl-10 pr-11 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:border-accent transition-colors" />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs bg-red-50 dark:bg-red-900/20 px-4 py-2.5 rounded-lg">{error}</motion.p>
              )}

              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-accent hover:bg-accent-dark disabled:opacity-60 text-white font-500 py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><LogIn size={15} /> Sign In to Dashboard</>
                }
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
