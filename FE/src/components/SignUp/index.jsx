// src/components/SignIn.js

import React, { useState } from "react";
import useSignUp from "./useSignUp";

const SignUp = () => {
  const { handleSignUp } = useSignUp();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Sign Up
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
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={(e) => {
              e?.preventDefault();
              handleSignUp.mutate(userData);
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
