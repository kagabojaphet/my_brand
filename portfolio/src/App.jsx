import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LoginModal from "./components/LoginModal";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import BlogDetail from "./pages/BlogDetail";
import Education from "./pages/Education";


// Admin
import AdminLayout from "./admin/components/AdminLayout";
import AdminOverview from "./admin/pages/AdminOverview";
import AdminVisitors from "./admin/pages/AdminVisitors";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import AdminPerformance from "./admin/pages/AdminPerformance";
import AdminMessages from "./admin/pages/AdminMessages";
import AdminBrand from "./admin/pages/AdminBrand";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminBlog from "./admin/pages/AdminBlog";

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Routes location={location} key="admin">
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminOverview />} />
          <Route path="visitors" element={<AdminVisitors />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="performance" element={<AdminPerformance />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="brand" element={<AdminBrand />} />
          <Route path="settings" element={<AdminSettings />} />
            <Route path="blog"        element={<AdminBlog />} />  
        </Route>
      </Routes>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        
<Route path="/education" element={<Education />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function PublicWrapper({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <>
      <Navbar />
      <LoginModal />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <PublicWrapper>
            <AnimatedRoutes />
          </PublicWrapper>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
