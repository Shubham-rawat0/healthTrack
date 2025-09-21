import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar({ onProfileUpdate }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm((prev) => ({ ...prev, [name]: files[0] }));
    else setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/profileUp`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(res.data.user);
      setEditing(false);
      onProfileUpdate?.(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1f2937",
          color: "white",
          padding: "0.5rem 1rem",
          width: "100%",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
          HealthTrack
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user && (
            <span style={{ fontWeight: "500", fontSize: "1rem" }}>
              {user.name}
            </span>
          )}
          <img
            src={user?.pfp || "/img/default.png"}
            alt="Profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white",
            }}
          />

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                fontSize: "1.5rem",
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              ⋮
            </button>
            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  right: 0,
                  background: "#fff",
                  color: "#000",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  width: "150px",
                  zIndex: 100,
                }}
              >
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setEditing(true);
                  }}
                  style={{
                    width: "100%",
                    padding: "0.4rem 0.8rem",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "0.4rem 0.8rem",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Edit Modal */}
      {editing && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1e293b", // Dark background
            color: "#f8fafc",
            padding: "2rem",
            borderRadius: "12px",
            zIndex: 101,
            width: "420px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.6)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <h2 style={{ marginBottom: "0.5rem", textAlign: "center" }}>
              Edit Profile
            </h2>

            {/* Custom File Upload */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={{ width: "100px" }}>Profile Pic</span>
              <input
                type="file"
                name="pfp"
                id="file-upload"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <label
                htmlFor="file-upload"
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Upload
              </label>
            </label>

            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Age", name: "age", type: "number" },
              { label: "Weight", name: "weight", type: "number" },
              { label: "Height", name: "height", type: "number" },
              { label: "Goal", name: "goal", type: "text" },
            ].map((field) => (
              <label
                key={field.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span style={{ width: "100px" }}>{field.label}</span>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    padding: "0.4rem",
                    borderRadius: "6px",
                    border: "1px solid #475569",
                    background: "#334155",
                    color: "#f1f5f9",
                  }}
                />
              </label>
            ))}

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  flex: 1,
                  background: "#64748b",
                  color: "#fff",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: "#16a34a",
                  color: "#fff",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
