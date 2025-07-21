import React, { useEffect, useState } from 'react';
import { Sparkles, User, LogOut, Loader2, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserProfile, logout as authLogout } from '../util/auth';

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const gradientColor = "bg-gradient-to-r from-primary via-purple-500 to-blue-500";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const profile = await getUserProfile();

        if (!profile) {
          throw new Error('No profile data returned');
        }

        setUser(profile);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError(err.message);

        // Clear tokens if we got unauthorized response
        if (err.message.includes('401')) {
          authLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    authLogout();
    setUser(null);
    navigate('/login');
  };

  const isWorkflowOrStack = ['/workflow', '/stack'].includes(location.pathname);

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 ${gradientColor} rounded-lg flex items-center justify-center`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!isWorkflowOrStack && (
              <span className="text-xl font-bold">FlowCraft AI</span>
            )}
          </div>

          {/* Middle - Navigation links (hidden on workflow/stack pages) */}
          {!isWorkflowOrStack && !loading && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-smooth">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">Contact</a>
            </div>
          )}

          {/* Right side - Conditional buttons */}
          <div className="flex items-center space-x-4">
            {isWorkflowOrStack && location.pathname === '/workflow' && (
              <Button 
              // className="bg-blue-600 hover:bg-blue-700 text-white"
              className={`${gradientColor}`}
              >
                Save  <Save />
              </Button>
            )}

            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : error ? (
              <Button
                variant="ghost"
                onClick={() => window.location.reload()}
                className="text-red-500"
              >
                Retry
              </Button>
            ) : user ? (
              <div className="relative group">
                <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-700" />
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {user.name || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : !isWorkflowOrStack && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className={`${gradientColor} text-white border-0 shadow-glow`}>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}