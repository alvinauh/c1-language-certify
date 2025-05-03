
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/layout/Layout";
import DashboardLayout from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TestInterface from "./pages/test/TestInterface";
import TestCatalog from "./pages/test/TestCatalog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>
              
              {/* Dashboard routes with sidebar layout */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<StudentDashboard subject="english" />} />
                <Route path="english" element={<StudentDashboard subject="english" />} />
                <Route path="math" element={<StudentDashboard subject="math" />} />
                <Route path="science" element={<StudentDashboard subject="science" />} />
                <Route path="history" element={<StudentDashboard subject="history" />} />
                <Route path="bahasa" element={<StudentDashboard subject="bahasa" />} />
                <Route path="mandarin" element={<StudentDashboard subject="mandarin" />} />
                <Route path="notes" element={<StudentDashboard subject="notes" />} />
              </Route>
              
              {/* Test catalog and specific subject/skill routes */}
              <Route path="tests" element={<DashboardLayout />}>
                <Route index element={<TestCatalog />} />
                <Route path=":subject/:skill" element={<TestCatalog />} />
              </Route>
              
              <Route path="test/:testId" element={<TestInterface />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
