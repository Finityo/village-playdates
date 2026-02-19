import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import Safety from "./pages/Safety";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import BrowseMoms from "./pages/BrowseMoms";
import MomProfile from "./pages/MomProfile";
import Messages from "./pages/Messages";
import Playdates from "./pages/Playdates";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import MapPage from "./pages/Map";
import BottomNav from "./components/BottomNav";
import MobileTopBar from "./components/MobileTopBar";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Pages that suppress the shell nav (top bar + bottom nav)
const SHELL_SUPPRESSED_ROUTES = ["/mom/", "/onboarding", "/messages", "/login", "/signup", "/privacy", "/safety", "/terms", "/"];

function Layout() {
  const location = useLocation();
  // "/" is always the public landing — suppress nav shell on it too
  const suppressShell = SHELL_SUPPRESSED_ROUTES.some(r =>
    r === "/" ? location.pathname === "/" : location.pathname.startsWith(r)
  );

  const pageTitles: Record<string, string> = {
    "/dashboard": "MomCircle",
    "/browse": "Find Moms",
    "/playdates": "Playdates",
    "/map": "Park Map",
    "/profile": "My Profile",
  };
  const title = pageTitles[location.pathname];

  return (
    <>
      {!suppressShell && <MobileTopBar title={title} />}
      <main className={`${suppressShell ? "" : "pt-14"} ${suppressShell ? "pb-0" : "pb-20"}`}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/terms" element={<Terms />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowseMoms /></ProtectedRoute>} />
          <Route path="/mom/:id" element={<ProtectedRoute><MomProfile /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/playdates" element={<ProtectedRoute><Playdates /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!suppressShell && <BottomNav />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
