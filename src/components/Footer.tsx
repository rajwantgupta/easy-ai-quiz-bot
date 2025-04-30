
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <Link to="/" className="text-lg font-bold text-primary">
              AutoAssess & Certify
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Automated document assessment and certification platform
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
            <Link to="/login" className="text-gray-500 hover:text-primary">
              Log In
            </Link>
            <Link to="/register" className="text-gray-500 hover:text-primary">
              Register
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>&copy; {currentYear} AutoAssess & Certify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
