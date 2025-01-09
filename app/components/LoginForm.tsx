"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Next.js 13 useRouter
import { FcGoogle } from 'react-icons/fc'; // Google icon with official colors


interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter(); // Initialize the useRouter hook
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
  
  };

  const handleGoogleLogin = async () => {
  
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-500">Login to your account</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 border border-gray-300 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </button>

          <div className="text-center space-y-2 mt-4">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register
              </a>
            </p>
            <a
              href="/reset-password"
              className="block text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
