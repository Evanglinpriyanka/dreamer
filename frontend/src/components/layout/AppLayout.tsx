import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Menu,
  X,
  LayoutDashboard,
  Map,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Roadmap", href: "/roadmap/product-manager", icon: Map },
];

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 h-16"
      >
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text hidden sm:inline">
                CareerDreamer
              </span>
            </button>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href === "/dashboard" &&
                  location.pathname === "/dashboard");
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="hidden sm:flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-16 left-0 right-0 z-40 glass border-b border-border/50 lg:hidden"
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left hover:bg-primary/10 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            ))}
            <hr className="my-2 border-border" />
            <button
              onClick={() => {
                navigate("/");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left hover:bg-primary/10 transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Sidebar (Desktop) */}
      {isSidebarOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className="hidden lg:flex flex-col fixed top-16 left-0 bottom-0 w-64 glass border-r border-border/50 z-30"
        >
          <div className="flex-1 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Quick Links
            </p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}

            <hr className="my-4 border-border" />

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Settings
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Account Settings
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-border/50">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">
                  john@example.com
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-0",
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
