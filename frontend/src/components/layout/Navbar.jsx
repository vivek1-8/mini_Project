import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Stethoscope, Phone, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Check login status (frontend only)
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  // ✅ Fetch nav links
  useEffect(() => {
    const fetchNavLinks = async () => {
      try {
        const response = await axios.get("/api/nav-links");
        setNavLinks(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch nav links:", error);
        setNavLinks([
          { name: "Home", path: "/" },
          { name: "Find Doctors", path: "/doctors" },
          { name: "About", path: "/about" },
          { name: "Contact", path: "/contact" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavLinks();
  }, []);

  // ✅ Handle appointment booking
  const handleBookAppointment = () => {
    if (isLoggedIn) {
      navigate("/doctors");
    } else {
      navigate("/login", {
        state: { from: location.pathname },
      });
    }
  };

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* ================= LOGO ================= */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Medi<span className="text-primary">Care</span>
            </span>
          </Link>

          {/* ================= DESKTOP NAV LINKS ================= */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-2",
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* ================= DESKTOP ACTIONS ================= */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>1-800-MEDICARE</span>
            </div>

            {!isLoggedIn && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>

                <Button asChild>
                  <Link to="/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </>
            )}

            {/* ✅ Book Appointment Button */}
            <Button variant="outline" onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          </div>

          {/* ================= MOBILE MENU TOGGLE ================= */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </>
              )}

              {/* ✅ Mobile Book Appointment */}
              <div className="pt-4 px-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    handleBookAppointment();
                  }}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
