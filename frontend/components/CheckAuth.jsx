import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckAuth = ({ children, isProtected = false }) => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAuthenticated(false);
          if (isProtected) navigate("/register");
          setLoading(false);
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/authenticate/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          if (isProtected) navigate("/login");
        }
      } catch (err) {
        console.error("Auth error:", err);
        setAuthenticated(false);
        if (isProtected) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [navigate, isProtected]);

  if (loading) {
    return (
      <div className="border border-gray-200 shadow rounded-md p-4 max-w-sm w-full mx-auto">
        <div className="flex space-x-4 animate-pulse">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      <p>loading</p>
        <div className="animate-pulse space-y-4 mt-4">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return <>{authenticated || !isProtected ? children : null}</>;
};

export default CheckAuth;
