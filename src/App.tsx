import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import BrowseMoms from "./pages/BrowseMoms";
import MomProfile from "./pages/MomProfile";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import MobileTopBar from "./components/MobileTopBar";

const queryClient = new QueryClient();

// Pages that show the profile detail (no top bar, back button handles nav)
const PROFILE_ROUTES = ["/mom/"];

function Layout() {
  const location = useLocation();
  const isProfilePage = PROFILE_ROUTES.some(r => location.pathname.startsWith(r));
  
  const pageTitles: Record<string, string> = {
    "/browse": "Find Moms",
    "/playdates": "Playdates",
    "/messages": "Messages",
    "/profile": "My Profile",
  };
  const title = pageTitles[location.pathname];

  return (
    <>
      {!isProfilePage && <MobileTopBar title={title} />}
      <main className={`${isProfilePage ? "" : "pt-14"} ${isProfilePage ? "pb-0" : "pb-20"}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<BrowseMoms />} />
          <Route path="/mom/:id" element={<MomProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isProfilePage && <BottomNav />}
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
