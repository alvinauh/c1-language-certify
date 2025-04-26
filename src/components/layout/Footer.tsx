
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">CEFR Test System</h3>
            <p className="text-sm text-muted-foreground">Accurate C1 level certification for students</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">FAQs</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} CEFR Test System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
