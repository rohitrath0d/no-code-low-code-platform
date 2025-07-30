/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Sparkles, User, LogOut, Loader2, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getUserProfile, logout as authLogout, API_BASE_URL } from '../util/auth';
import { toast } from "sonner"
import { useWorkflow } from '../contexts/WorkflowContext';


export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');

  const { nodes, edges } = useWorkflow();
  const { stackId } = useParams();

  const gradientColor = "bg-gradient-to-r from-primary via-purple-500 to-blue-500";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only fetch if we have a token
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

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
  }, [location.pathname]);


  const handleSave = async () => {
    try {
      // const res = await fetch(`http://127.0.0.1:8000/api/workflow/${stackId}`, {
      const res = await fetch(`${API_BASE_URL}/api/workflow/${stackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          // name: "Saved Workflow",
          // name: form.name,
          // name: data.name,
          name: workflowName,
          // description: "Manually saved",
          // description: data.description,
          description: workflowDescription,
          components: {
            // nodes: nodes,
            edges: edges,
            nodes: nodes.map(node => ({
              id: node.id,
              type: node.type,
              position: node.position,
              data: node.data,
              width: node.width,
              height: node.height
            }))
          }
        })
      });

      if (!res.ok) throw new Error("Save failed");
      toast("Workflow saved successfully!");
    } catch (err) {
      toast(err.message);
    }
  };

  useEffect(() => {
    const loadWorkflow = async () => {
      if (!stackId) return;

      try {
        // const res = await fetch(`http://127.0.0.1:8000/api/workflow/load/${stackId}`);
        const res = await fetch(`${API_BASE_URL}/api/workflow/load/${stackId}`);
        const data = await res.json();

        setWorkflowName(data.name || 'Untitled Workflow');
        setWorkflowDescription(data.description || '');
      } catch (err) {
        console.error("Failed to load workflow metadata", err);
      }
    };

    loadWorkflow();
  }, [stackId]);



  const handleLogout = () => {
    authLogout();
    setUser(null);
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isHomePage = location.pathname === '/';
  const isStackPage = location.pathname === '/stack';
  const isEditorPage = location.pathname.startsWith('/editor/');

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 bg-gradient-to-r from-purple-200 via-purple-100 to-pink-200">
      <div className="max-w-9xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 ${gradientColor} rounded-lg flex items-center justify-center`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">FlowCraft AI</span>
          </div>

          {/* Middle - Navigation links (only show on home page) */}
          {isHomePage && !loading && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">Features</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">Contact</a>
            </div>
          )}

          {/* Right side - Conditional buttons */}
          <div className="flex items-center space-x-4">
            {isEditorPage && (
              <Button
                className={`${gradientColor}`}
                onClick={handleSave}
              >
                Save <Save className="ml-2" />
              </Button>
            )}

            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : error ? (
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-white bg-red-500"
              >
                Retry Login
              </Button>
            ) : user ? (
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center hover:bg-purple-400">
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
                <div className="absolute right-0 mt-2 w-48 bg-purple-200 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b">
                    {user.name || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : !isAuthPage && !isStackPage && !isEditorPage && (
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