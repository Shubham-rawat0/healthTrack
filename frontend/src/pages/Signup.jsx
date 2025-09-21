import React, { useState } from "react";

// This is a single-file, self-contained React component.
// External libraries like React Router and axios are not used
// to keep the file runnable without a build process.

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
  const [isSuccess, setIsSuccess] = useState(false);

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
    setIsSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            age: parseInt(formData.age),
            name: formData.name,
          }),
        }
      );

      if (response.ok) {
        setMessage("Sign-up successful! You can now log in.");
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Server error"}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
        .container {
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          padding: 1rem;
          font-family: sans-serif;
        }

        .form-container {
          width: 100%;
          max-width: 32rem;
          border-radius: 1rem;
          background-color: white;
          padding: 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .title {
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
        }

        .subtitle {
          margin-bottom: 2rem;
          text-align: center;
          color: #4b5563;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .label {
          margin-bottom: 0.5rem;
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease-in-out;
          outline: none;
          box-sizing: border-box;
        }

        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .input-error {
          border-color: #ef4444;
        }

        .error-text {
          margin-top: 0.25rem;
          font-size: 0.875rem;
          color: #ef4444;
        }

        .submit-button {
          width: 100%;
          border-radius: 0.5rem;
          background-color: #4f46e5;
          padding: 0.75rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          transition: all 0.3s ease-in-out;
          border: none;
          cursor: pointer;
        }

        .submit-button:hover:not(:disabled) {
          transform: scale(1.05);
          background-color: #4338ca;
        }
        
        .submit-button:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
          transform: scale(1);
        }

        .message {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .message-error {
          color: #dc2626;
        }

        .message-success {
          color: #16a34a;
        }

        .footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: #4b5563;
        }

        .link {
          font-weight: 600;
          color: #4f46e5;
          text-decoration: none;
          transition: color 0.3s ease-in-out;
        }

        .link:hover {
          color: #3730a3;
        }
        `}
      </style>
      <div className="container">
        <div className="form-container">
          <h1 className="title">Sign Up</h1>
          <p className="subtitle">
            Create your account to get started with HealthTrack.
          </p>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label className="label" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? "input-error" : ""}`}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="input-group">
              <label className="label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="input-group">
              <label className="label" htmlFor="age">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`input ${errors.age ? "input-error" : ""}`}
              />
              {errors.age && <p className="error-text">{errors.age}</p>}
            </div>

            <div className="input-group">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input ${errors.password ? "input-error" : ""}`}
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <div className="input-group">
              <label className="label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
              />
              {errors.confirmPassword && (
                <p className="error-text">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? "" : "btn-hover"}`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {message && (
            <p
              className={`message ${
                message.includes("Error") ? "message-error" : "message-success"
              }`}
            >
              {message}
            </p>
          )}

          <div className="footer">
            Already have an account?{" "}
            <a href="#" className="link">
              Log In
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
