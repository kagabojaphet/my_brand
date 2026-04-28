import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import PageWrapper from "../components/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <Helmet><title>404 — Page Not Found</title></Helmet>
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-mono text-accent text-sm mb-4">404 error</p>
            <h1 className="font-display text-8xl md:text-[160px] font-700 text-neutral-100 dark:text-neutral-900 leading-none mb-6">Oops</h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-sm mx-auto">
              This page doesn't exist — but the rest of the site is pretty great.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/" className="bg-accent hover:bg-accent-dark text-white font-500 px-7 py-3.5 rounded-full transition-all hover:scale-105">
                Go Home →
              </Link>
              <Link to="/projects" className="border border-neutral-200 dark:border-neutral-800 hover:border-accent font-500 px-7 py-3.5 rounded-full transition-all hover:text-accent">
                View Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
