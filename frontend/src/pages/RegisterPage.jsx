import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL } from "@/util/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // const res = await fetch("http://127.0.0.1:8000/users/", {
      const res = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
      <div className="flex w-full max-w-6xl shadow-lg bg-white rounded-xl overflow-hidden bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100">
        {/* Left side: background graphic */}

        <div
          className="hidden md:flex flex-1 bg-cover bg-center items-center justify-center"
        // style={{ backgroundImage: "url('/your-image.jpg')" }}
        >

          <img
            src="images/images.png"
          />
          {/* <div className="text-center p-8 bg-white/70 rounded-xl backdrop-blur-sm"> */}
          {/* <div className="text-center p-8 rounded-xl backdrop-blur-sm bg-gradient-to-r from-gray-100 via-purple-100 to-blue-100"> */}
          {/* <h2 className="text-3xl font-semibold text-gray-800 mb-4">No-Code / Low-Code</h2> */}
          {/* <p className="text-gray-600">Streamlined onboarding. Get started in minutes.</p> */}
          {/* </div> */}
        </div>

        {/* Right side: registration form */}
        <div className="w-full md:w-1/2 p-8">
          <Card className="w-full bg-gradient-to-r from-purple-50-100 via-purple-100 to-blue-100">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Register</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90">
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
