import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore"; // import your auth store

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ["Home", "Explore", "About"];
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

  // Add "Student Dashboard" if user is logged in
  const navLinks = user ? [...links, "Student Dashboard"] : links;

  const handleAuthClick = async () => {
    if (user) {
      await logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-60 px-6 py-4 flex items-center justify-between bg-transparent backdrop-blur-md transition-all duration-300">
      {/* Logo */}
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        EduBridge
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8">
        {navLinks.map((link, idx) => (
          <Link
            to={`/${link.toLowerCase().replace(" ", "-")}`}
            key={idx}
            className="relative cursor-pointer transition-all duration-300 hover:text-blue-600"
          >
            {link}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[hsl(var(--neon-lime))] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </ul>

      {/* Auth Button */}
      <button
        onClick={handleAuthClick}
        className="hidden md:block bg-[var(--btn-primary)] text-white px-4 py-1 rounded-lg cursor-pointer"
      >
        {user ? "Logout" : "Login"}
      </button>

      {/* Mobile Menu Button */}
      <div
        className="md:hidden cursor-pointer z-[60] absolute top-5 right-6 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} color="black" /> : <Menu size={28} color="black" />}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center z-50 gap-6 md:hidden transition-all duration-300">
          {navLinks.map((link, idx) => (
            <Link
              to={`/${link.toLowerCase().replace(" ", "-")}`}
              key={idx}
              className="text-2xl hover:text-blue-600 cursor-pointer transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {link}
            </Link>
          ))}

          <button
            onClick={() => {
              setIsOpen(false);
              handleAuthClick();
            }}
            className="bg-[var(--btn-primary)] mt-4 text-white px-4 py-1 rounded-lg cursor-pointer"
          >
            {user ? "Logout" : "Sign Up"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
