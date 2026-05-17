import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AppStateProvider } from "@/contexts/AppStateContext";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import GeneratorPage from "./pages/GeneratorPage";
import StepsPage from "./pages/StepsPage";
import AccountPage from "./pages/AccountPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const routerBasename =
  import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

const AuthenticatedApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-[32px] text-ethereal-glow">progress_activity</span>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <>
      <Routes>
        <Route path="/" element={<GeneratorPage />} />
        <Route path="/steps" element={<StepsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AppStateProvider>
          <Sonner />
          <BrowserRouter
            basename={routerBasename}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <AuthenticatedApp />
          </BrowserRouter>
        </AppStateProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
