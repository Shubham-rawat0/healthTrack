import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
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
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#111827",
      color: "white",
      padding: "1rem 2rem",
    },
    logo: { fontSize: "1.5rem", fontWeight: "bold", margin: 0 },
    navRight: { display: "flex", alignItems: "center", gap: "3rem" },
    userName: { fontWeight: "500", fontSize: "1rem" },
    profileButton: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      border: "2px solid white",
      backgroundColor: "transparent",
      cursor: "pointer",
      padding: 0,
      transition: "transform 0.2s ease, border-color 0.2s ease",
    },
    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover",
    },
    main: {
      flex: 1,
      overflowY: "auto",
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      gap: "3rem",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "2rem",
      padding: "1rem 0",
    },
    textContainer: {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    sectionTitle: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: "black",
    },
    sectionText: { color: "black", lineHeight: "1.5", marginBottom: "1rem" },
    sectionButton: {
      width: "130px",
      padding: "0.5rem",
      borderRadius: "15px",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
    workoutButton: {
      background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      color: "white",
      alignSelf: "center",
    },
    mealButton: {
      background: "linear-gradient(135deg, #f59e0b, #f97316)",
      color: "white",
      alignSelf: "center",
    },
    footer: {
      backgroundColor: "#000000",
      textAlign: "center",
      padding: "1rem 2rem",
      color: "white",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 50,
    },
    form: {
      width: "100%",
      maxWidth: "400px",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      border: "1px solid #d1d5db",
      padding: "1.5rem",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      backgroundColor: "white",
    },
    input: {
      width: "100%",
      border: "1px solid #d1d5db",
      padding: "0.4rem",
      borderRadius: "0.25rem",
      fontSize: "1rem",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "0.75rem",
    },
    cancelButton: {
      width: "50%",
      backgroundColor: "#d1d5db",
      color: "black",
      padding: "0.4rem 0",
      borderRadius: "0.25rem",
      border: "none",
      cursor: "pointer",
    },
    saveButton: {
      width: "50%",
      backgroundColor: "#2563eb",
      color: "white",
      padding: "0.4rem 0",
      borderRadius: "0.25rem",
      border: "none",
      cursor: "pointer",
    },
    collageContainer: { position: "relative", width: "100%", height: "350px" },
  };

  if (!user)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>HealthTrack</h1>
        <div style={styles.navRight}>
          <span style={styles.userName}>{user.name}</span>
          <button onClick={() => setEditing(true)} style={styles.profileButton}>
            <img
              src={user.pfp || "/img/defaultpfp.png"}
              alt="Profile"
              style={styles.profileImage}
            />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Workout Section */}
        <div style={styles.section}>
          <div style={{ ...styles.collageContainer }}>
            {/* Middle landscape (largest) */}
            <img
              src="/img/workout.png"
              alt="Workout main"
              style={{
                position: "absolute",
                width: "320px",
                height: "180px",
                top: "70px",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "0.5rem",
                zIndex: 3,
                objectFit: "cover",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform =
                  "translateX(-50%) scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateX(-50%) scale(1)")
              }
            />
            {/* Left portrait (number 1) */}
            <img
              src="/img/workout1.png"
              alt="Workout left"
              style={{
                position: "absolute",
                width: "270px",
                height: "180px",
                top: "30px",
                left: "calc(50% - 220px)",
                borderRadius: "0.5rem",
                zIndex: 2,
                objectFit: "cover",
                opacity: 0.9,
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            {/* Right portrait (number 2) */}
            <img
              src="/img/workout2.png"
              alt="Workout right"
              style={{
                position: "absolute",
                width: "240px",
                height: "160px",
                top: "120px",
                left: "calc(50% + 80px)",
                borderRadius: "0.5rem",
                zIndex: 1,
                objectFit: "cover",
                opacity: 0.9,
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <div style={styles.textContainer}>
            <h2 style={styles.sectionTitle}>Workout Tracking</h2>
            <p style={styles.sectionText}>
              HealthTrack helps you track your <b>workouts</b>, monitor daily
              exercise progress, and build consistent fitness habits.
            </p>
            <button
              style={{ ...styles.sectionButton, ...styles.workoutButton }}
              onClick={() => navigate("/workout")}
            >
              View Workouts
            </button>
          </div>
        </div>

        {/* Meal Section */}
        <div style={styles.section}>
          <div style={{ ...styles.collageContainer }}>
            <img
              src="/img/meal.png"
              alt="Meal main"
              style={{
                position: "absolute",
                width: "320px",
                height: "180px",
                top: "70px",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "0.5rem",
                zIndex: 3,
                objectFit: "cover",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform =
                  "translateX(-50%) scale(1.05)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateX(-50%) scale(1)")
              }
            />
            <img
              src="/img/meal1.png"
              alt="Meal left"
              style={{
                position: "absolute",
                width: "270px",
                height: "180px",
                top: "30px",
                left: "calc(50% - 220px)",
                borderRadius: "0.5rem",
                zIndex: 2,
                objectFit: "cover",
                opacity: 0.9,
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <img
              src="/img/meal2.png"
              alt="Meal right"
              style={{
                position: "absolute",
                width: "240px",
                height: "160px",
                top: "120px",
                left: "calc(50% + 80px)",
                borderRadius: "0.5rem",
                zIndex: 1,
                objectFit: "cover",
                opacity: 0.9,
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          <div style={styles.textContainer}>
            <h2 style={styles.sectionTitle}>Meal Tracking</h2>
            <p style={styles.sectionText}>
              Stay on top of your <b>nutrition</b> with HealthTrack. Log your
              meals, track calories, and build healthier eating patterns.
            </p>
            <button
              style={{ ...styles.sectionButton, ...styles.mealButton }}
              onClick={() => navigate("/meal")}
            >
              View Meals
            </button>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editing && (
        <div style={styles.modal}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="file"
              name="pfp"
              onChange={handleChange}
              style={styles.input}
            />
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="Name"
              style={styles.input}
            />
            <input
              type="number"
              name="age"
              value={form.age || ""}
              onChange={handleChange}
              placeholder="Age"
              style={styles.input}
            />
            <input
              type="number"
              name="weight"
              value={form.weight || ""}
              onChange={handleChange}
              placeholder="Weight (kg)"
              style={styles.input}
            />
            <input
              type="number"
              name="height"
              value={form.height || ""}
              onChange={handleChange}
              placeholder="Height (cm)"
              style={styles.input}
            />
            <div style={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" style={styles.saveButton}>
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          <span style={{ fontWeight: "500" }}>Goal:</span> {user.goal}
        </p>
      </footer>
    </div>
  );
}
