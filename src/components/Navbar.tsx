import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
            <span className="text-lg font-bold text-primary-foreground">C</span>
          </div>
          <span className="text-xl font-bold text-foreground">CareContext</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated && user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.name} ({user.role})
              </span>
              {user.role === 'patient' && (
                <Link to="/patient/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              )}
              {user.role === 'doctor' && (
                <>
                  <Link to="/doctor/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/doctor/flagged" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                    Flagged
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/patient/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Patient Login
              </Link>
              <Link to="/doctor/login" className="rounded-lg gradient-hero px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                Doctor Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-border bg-card px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {isAuthenticated && user ? (
              <>
                <span className="text-sm text-muted-foreground">{user.name}</span>
                {user.role === 'patient' && (
                  <Link to="/patient/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Dashboard</Link>
                )}
                {user.role === 'doctor' && (
                  <>
                    <Link to="/doctor/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Dashboard</Link>
                    <Link to="/doctor/flagged" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Flagged</Link>
                  </>
                )}
                <button onClick={handleLogout} className="text-sm font-medium text-destructive">Logout</button>
              </>
            ) : (
              <>
                <Link to="/patient/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Patient Login</Link>
                <Link to="/doctor/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-foreground">Doctor Login</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
