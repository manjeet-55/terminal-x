// src/components/SignIn.js

import React, { useState } from "react";
import useSignIn from "./useSignIn";

const SignIn = () => {
  const { handleSignIn } = useSignIn();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome Back!
        </h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              onChange={(e) => {
                setUserData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          
          <Button          
            type="submit"
            onClick={(e) => {
              e?.preventDefault();
              handleSignIn.mutate(userData);
            }}
            variant="primary"
            > Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
