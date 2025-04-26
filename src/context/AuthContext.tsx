
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // In a real app, this would connect to Supabase Auth
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulated login for now - this would be replaced with Supabase Auth
      // Once Supabase is connected, we'd use their auth APIs instead
      console.log("Logging in with:", { email, password });
      
      // Simulate successful login
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
        role: 'student'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "Login Successful",
        description: "Welcome back to the CEFR Test System!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    setLoading(true);
    try {
      // Simulated registration - would be replaced with Supabase Auth
      console.log("Registering:", { name, email, password, role });
      
      // Simulate successful registration
      const mockUser: User = {
        id: 'user-' + Math.random().toString(36).substring(2, 9),
        email,
        name,
        role: role === 'admin' ? 'admin' : 'student'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "Registration Successful",
        description: "Welcome to the CEFR Test System!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      // Simulated password reset - would be replaced with Supabase Auth
      console.log("Reset password for:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reset Link Sent",
        description: "If your email is registered with us, you'll receive a password reset link.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
