import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
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

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f3f4f6",
      padding: "1rem",
      fontFamily: "Arial, sans-serif",
    },
    formContainer: {
      width: "100%",
      maxWidth: "448px",
      borderRadius: "1rem",
      backgroundColor: "white",
      padding: "2rem",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    title: {
      marginBottom: "1.5rem",
      textAlign: "center",
      fontSize: "1.875rem",
      fontWeight: "bold",
      color: "#1f2937",
      margin: "0 0 1.5rem 0",
    },
    subtitle: {
      marginBottom: "2rem",
      textAlign: "center",
      color: "#4b5563",
      margin: "0 0 2rem 0",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "0.5rem",
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
    },
    input: {
      width: "100%",
      borderRadius: "0.5rem",
      border: "1px solid #d1d5db",
      padding: "0.5rem 1rem",
      transition: "all 0.3s ease",
      fontSize: "1rem",
      outline: "none",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)",
    },
    inputError: {
      borderColor: "#ef4444",
    },
    errorText: {
      marginTop: "0.25rem",
      fontSize: "0.875rem",
      color: "#ef4444",
    },
    submitButton: {
      width: "100%",
      transform: "scale(1)",
      borderRadius: "0.5rem",
      backgroundColor: "#2563eb",
      padding: "0.75rem",
      fontSize: "1.125rem",
      fontWeight: "bold",
      color: "white",
      transition: "all 0.3s ease",
      border: "none",
      cursor: "pointer",
    },
    submitButtonHover: {
      transform: "scale(1.05)",
      backgroundColor: "#1d4ed8",
    },
    submitButtonDisabled: {
      backgroundColor: "#9ca3af",
      cursor: "not-allowed",
      transform: "scale(1)",
    },
    message: {
      marginTop: "1rem",
      textAlign: "center",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    messageError: {
      color: "#dc2626",
    },
    messageSuccess: {
      color: "#16a34a",
    },
    footer: {
      marginTop: "1.5rem",
      textAlign: "center",
      fontSize: "0.875rem",
      color: "#4b5563",
    },
    link: {
      fontWeight: "600",
      color: "#2563eb",
      textDecoration: "none",
      transition: "color 0.3s ease",
    },
    linkHover: {
      color: "#1e40af",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Log In</h1>
        <p style={styles.subtitle}>
          Welcome back! Please log in to your account.
        </p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  Object.assign(e.target.style, styles.inputFocus);
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email
                  ? "#ef4444"
                  : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  Object.assign(e.target.style, styles.inputFocus);
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.password
                  ? "#ef4444"
                  : "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
            {errors.password && (
              <p style={styles.errorText}>{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.submitButtonDisabled : {}),
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                Object.assign(e.target.style, styles.submitButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "scale(1)";
                e.target.style.backgroundColor = "#2563eb";
              }
            }}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              ...(message.includes("Error")
                ? styles.messageError
                : styles.messageSuccess),
            }}
          >
            {message}
          </p>
        )}

        <div style={styles.footer}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={styles.link}
            onMouseEnter={(e) => {
              e.target.style.color = styles.linkHover.color;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = styles.link.color;
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
