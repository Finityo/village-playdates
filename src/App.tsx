import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import BrowseMoms from "./pages/BrowseMoms";
import MomProfile from "./pages/MomProfile";
import Messages from "./pages/Messages";
import Playdates from "./pages/Playdates";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import MobileTopBar from "./components/MobileTopBar";

const queryClient = new QueryClient();

// Pages that suppress the shell nav
const SHELL_SUPPRESSED_ROUTES = ["/mom/", "/onboarding", "/messages"];

function Layout() {
  const location = useLocation();
  const suppressShell = SHELL_SUPPRESSED_ROUTES.some(r => location.pathname.startsWith(r));

  const pageTitles: Record<string, string> = {
    "/": "MomCircle",
    "/browse": "Find Moms",
    "/playdates": "Playdates",
    "/profile": "My Profile",
  };
  const title = pageTitles[location.pathname];

  return (
    <>
      {!suppressShell && <MobileTopBar title={title} />}
      <main className={`${suppressShell ? "" : "pt-14"} ${suppressShell ? "pb-0" : "pb-20"}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<BrowseMoms />} />
          <Route path="/mom/:id" element={<MomProfile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/playdates" element={<Playdates />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile" element={<Profile />} />
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
        <Layout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
