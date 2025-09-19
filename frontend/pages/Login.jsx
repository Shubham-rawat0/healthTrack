import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 

const Login= () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/user/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 200) {
        setMessage("Login successful!");
        localStorage.setItem("token", response.data.token);
        navigate("/"); 
      }
    } catch (error) {
      if (error.response) {
       
        setMessage(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      } else if (error.request) {
        setMessage(
          "Error: No response from server. Please check your network."
        );
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Log In
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Welcome back! Please log in to your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full transform rounded-lg bg-blue-600 py-3 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
