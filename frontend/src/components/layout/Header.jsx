import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, User, Menu, X } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          withCredentials: true,
        });

        // expected response:
        // { fullName, role }
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const getDashboardPath = () => {
    if (user?.role === 'doctor') return '/doctor-dashboard';
    if (user?.role === 'patient') return '/patient-dashboard';
    return '/';
  };

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-soft">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Medi<span className="text-primary">Care</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Dashboard
              </Link>

              {user?.role === 'patient' && (
                <Link
                  to="/doctors"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Find Doctors
                </Link>
              )}

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {user?.fullName}
                  </span>
                </div>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Login
              </Link>

              <Button asChild size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden animate-slide-up">
          <nav className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {user?.fullName}
                  </span>
                </div>

                <Link
                  to={getDashboardPath()}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {user?.role === 'patient' && (
                  <Link
                    to="/doctors"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Find Doctors
                  </Link>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>

                <Button asChild size="sm">
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
