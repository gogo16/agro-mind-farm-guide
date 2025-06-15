
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import MapView from "./pages/MapView";
import Planning from "./pages/Planning";
import Finance from "./pages/Finance";
import FieldDetails from "./pages/FieldDetails";
import Modules from "./pages/Modules";
import Documents from "./pages/Documents";
import Inventory from "./pages/Inventory";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />
              <Route path="/planning" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
              <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
              <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/field/:id" element={<ProtectedRoute><FieldDetails /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
