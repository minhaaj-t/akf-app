import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useAuth } from "../contexts/AuthContext";
import { Utensils } from "lucide-react";

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    const success = await login(username, password);
    if (!success) {
      setError("Invalid credentials or account not approved");
    } else {
      setError("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2 flex items-center justify-center gap-2"><Utensils size={36} className="inline text-black" /> Ajman Mess Food</h1>
        <p className="text-gray-500">Fresh homemade meals delivered daily</p>
      </div>

      <Card className="w-full max-w-md bg-white border border-black shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils size={32} className="text-white" />
            </div>
            <h2 className="font-bold text-2xl text-gray-800 mb-2">
              Sign In
            </h2>
            <p className="text-gray-600">
              Access your mess food account
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <Input
                className="h-12 bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                className="h-12 bg-gray-50 border-gray-200 focus:border-red-500 focus:ring-red-500"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <Button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 bg-black hover:bg-gray-800 font-semibold text-white"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};