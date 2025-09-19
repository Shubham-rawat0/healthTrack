import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
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
    if (!formData.name) {
      newErrors.name = "Name is required.";
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.age) {
      newErrors.age = "Age is required.";
    } else if (isNaN(formData.age) || formData.age < 18) {
      newErrors.age = "Age must be a number and 18 or older.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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
        `${import.meta.env.VITE_BACKEND_API}/api/user/signup`,
        {
          email: formData.email,
          password: formData.password,
          age: parseInt(formData.age), 
          name: formData.name,
        }
      );

      if (response.status === 201) {
        setMessage("Sign-up successful! Redirecting to login...");
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage(`Error: ${error.response.data.message || "Server error"}`);
        } else if (error.request) {
          setMessage(
            "Error: No response from server. Please check your network."
          );
        } else {
          setMessage("An unexpected error occurred. Please try again.");
        }
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Sign Up
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Create your account to get started with HealthTrack.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

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
              htmlFor="age"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 ${
                errors.age
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-500">{errors.age}</p>
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

          {/* Confirm Password Field */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-gray-700"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 transition duration-300 focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full transform rounded-lg bg-indigo-600 py-3 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Sign Up"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
