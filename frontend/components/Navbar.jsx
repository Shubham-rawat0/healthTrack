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
      onProfileUpdate?.(res.data.user); // inform parent
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
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1f2937",
          color: "white",
          padding: "1rem",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>HealthTrack</h1>
        <div style={{ position: "relative", marginRight: "50px" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid white",
              cursor: "pointer",
              background: "transparent",
              padding: 0,
            }}
          >
            <img
              src={user?.pfp || "/img/defaultpfp.png"}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </button>
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "50px",
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
                  padding: "0.5rem 1rem",
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
                  padding: "0.5rem 1rem",
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
      </nav>

      {editing && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#f1f5f9",
            padding: "2rem",
            borderRadius: "12px",
            zIndex: 100,
            width: "400px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label>Edit</label>
            <input type="file" name="pfp" placeholder="pfp" onChange={handleChange} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={form.weight || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={form.height || ""}
              onChange={handleChange}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
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
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: "#2563eb",
                  color: "#fff",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "none",
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
