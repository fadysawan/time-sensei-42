import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserConfigurationProvider } from "./contexts/UserConfigurationContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TradingDataProvider } from "./contexts/TradingDataContext";
import { TradingStatusProvider } from "./contexts/TradingStatusContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GlobalLayout } from "./components/GlobalLayout";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import { Login } from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Get the base path for GitHub Pages (only when VITE_BASE_PATH is set)
const basename = import.meta.env.VITE_BASE_PATH || '';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <UserConfigurationProvider>
          <ThemeProvider>
            <TradingDataProvider>
              <BrowserRouter basename={basename}>
                <GlobalLayout>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/oauth/callback" element={<OAuthCallback />} />
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </GlobalLayout>
              </BrowserRouter>
            </TradingDataProvider>
          </ThemeProvider>
        </UserConfigurationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
