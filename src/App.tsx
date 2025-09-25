import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserConfigurationProvider } from "./contexts/UserConfigurationContext";
import { TradingDataProvider } from "./contexts/TradingDataContext";
import { TradingStatusProvider } from "./contexts/TradingStatusContext";
import { GlobalLayout } from "./components/GlobalLayout";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get the base path for GitHub Pages
const basename = process.env.NODE_ENV === 'production' ? '/time-sensei-42' : '';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserConfigurationProvider>
        <TradingDataProvider>
          <BrowserRouter basename={basename}>
            <GlobalLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/settings" element={<Settings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </GlobalLayout>
          </BrowserRouter>
        </TradingDataProvider>
      </UserConfigurationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
