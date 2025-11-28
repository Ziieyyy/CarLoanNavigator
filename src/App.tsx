import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Cars from "./pages/Cars";
import CarDetail from "./pages/CarDetail";
import Calculator from "./pages/Calculator";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCars from "./pages/admin/ManageCars";
import CarForm from "./pages/admin/CarForm";
import ManageBanks from "./pages/admin/ManageBanks";
import BankDetail from "./pages/BankDetail";
import NotFound from "./pages/NotFound";
import StaggeredMenuDemo from "./pages/StaggeredMenuDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              <Route path="/cars" element={
                <ProtectedRoute>
                  <Cars />
                </ProtectedRoute>
              } />
              
              <Route path="/cars/:id" element={
                <ProtectedRoute>
                  <CarDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/calculator" element={
                <ProtectedRoute>
                  <Calculator />
                </ProtectedRoute>
              } />
              
              <Route path="/banks/:id" element={
                <ProtectedRoute>
                  <BankDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              <Route path="/admin/cars" element={
                <AdminRoute>
                  <ManageCars />
                </AdminRoute>
              } />
              
              <Route path="/admin/cars/new" element={
                <AdminRoute>
                  <CarForm />
                </AdminRoute>
              } />
              
              <Route path="/admin/cars/edit/:id" element={
                <AdminRoute>
                  <CarForm />
                </AdminRoute>
              } />
              
              <Route path="/admin/banks" element={
                <AdminRoute>
                  <ManageBanks />
                </AdminRoute>
              } />
              
              <Route path="/staggered-menu-demo" element={<StaggeredMenuDemo />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;