import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <main className="welcome-main">
        <div className="background-gradient"></div>

        <div className="welcome-card">
          <h1 className="welcome-title">Welcome to HealthTrack</h1>
          <p className="welcome-text">
            Begin your journey to a healthier life with HealthTrack. Track your
            daily exercises, log meals, set goals, and monitor progress with
            ease. Organized lists and detailed insights help you stay motivated
            and achieve your personal best every day.
          </p>

          <div className="welcome-buttons">
            <Link to="/signup" className="btn-signup">
              Sign Up
            </Link>
            <Link to="/login" className="btn-login">
              Log In
            </Link>
          </div>
        </div>
      </main>

      <footer className="welcome-footer">
        <p>
          &copy; {new Date().getFullYear()} HealthTrack. All rights reserved.
        </p>
      </footer>

      <style>
        {`
          /* Container */
          .welcome-container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            color: #f1f5f9;
          }

          /* Main Section */
          .welcome-main {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem 1.5rem;
          }

          .background-gradient {
            position: absolute;
            inset: 0;
            z-index: 0;
            opacity: 0.85;
          }

          /* Card */
          .welcome-card {
            position: relative;
            z-index: 10;
            background: rgba(15, 23, 42, 0.9); /* dark card background */
            border-radius: 2rem;
            padding: 3rem 2.5rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            transition: all 0.4s ease;
          }

          .welcome-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          }

          /* Title and text */
          .welcome-title {
            font-size: 2.8rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            color: #f1f5f9;
          }

          .welcome-text {
            font-size: 1.2rem;
            color: #e5e7eb;
            margin-bottom: 2rem;
            line-height: 1.7;
          }

          /* Buttons */
          .welcome-buttons {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          @media(min-width: 640px) {
            .welcome-buttons {
              flex-direction: row;
              justify-content: center;
            }
          }

          .btn-signup {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            background: #14b8a6; /* teal */
            color: #fff;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .btn-signup:hover {
            background: #0d9488;
            transform: translateY(-2px) scale(1.02);
          }

          .btn-login {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            background: #1f2937; /* dark gray */
            color: #f1f5f9;
            border: 1px solid #4b5563;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .btn-login:hover {
            background: #111827;
            transform: translateY(-2px) scale(1.02);
          }

          /* Footer */
          .welcome-footer {
            background-color: #111827;
            color: #9ca3af;
            text-align: center;
            padding: 1rem 0;
            font-size: 0.875rem;
          }
        `}
      </style>
    </div>
  );
};

export default Welcome;
