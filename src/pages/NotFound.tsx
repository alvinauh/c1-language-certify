
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if this might be a direct language navigation attempt
  const isLanguageNavigation = ['/english', '/bahasa', '/mandarin', '/math', '/science', '/history'].some(
    path => location.pathname === path
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        
        {isLanguageNavigation && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800">
              It looks like you're trying to access a subject page directly. 
              Please use the dashboard to access your subjects.
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/">Return to Home</Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
