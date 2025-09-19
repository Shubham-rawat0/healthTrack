import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
  
      <main className="relative flex flex-grow items-center justify-center p-6">
       
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-70"></div>

        <div className="relative z-10 flex w-full max-w-xl flex-col items-center rounded-3xl bg-white/95 p-10 text-center shadow-2xl backdrop-blur-md transition-all duration-500 hover:shadow-3xl sm:p-12">
         
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
         
            <span role="img" aria-label="Heartbeat" className="text-4xl">
              ❤️
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Welcome to HealthTrack
          </h1>
          <p className="mb-8 max-w-prose text-lg text-gray-600 sm:text-xl">
            Your personal journey to a healthier life starts here. Track your
            progress, set goals, and achieve your personal best.
          </p>

          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="w-full transform rounded-full bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="w-full transform rounded-full border border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-800 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-gray-900 py-4 text-center text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} HealthTrack. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Welcome;
