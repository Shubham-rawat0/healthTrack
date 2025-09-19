import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [workoutImage, setWorkoutImage] = useState("");
  const [mealImage, setMealImage] = useState("");
  const [background, setBackground] = useState("");
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

    // Randomly select workout and meal images
    const workoutImages = [
      "/img/workout.png",
      "/img/workout1.png",
      "/img/workout2.png",
    ];
    const mealImages = ["/img/meal.png", "/img/meal1.png", "/img/meal2.png"];
    setWorkoutImage(
      workoutImages[Math.floor(Math.random() * workoutImages.length)]
    );
    setMealImage(mealImages[Math.floor(Math.random() * mealImages.length)]);

    // Randomly select background color
    const backgrounds = ["#0f4c5c", "#064663", "#1a374d", "#2e8b57", "#23475d"]; // teal/dark tones
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
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
      backgroundColor: background,
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#1f2937",
      color: "white",
      padding: "1rem",
      margin: 0,
      width: "100%",
    },
    logo: { fontSize: "1.5rem", fontWeight: "bold", margin: 0 },
    navRight: {
      display: "flex",
      alignItems: "center",
      gap: "3rem",
      paddingRight: "2rem",
    },
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
      gap: "4rem",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: "80%",
      margin: "0 auto",
      gap: "2rem",
      padding: "2rem",
      border: "2px solid #d1d5db",
      borderRadius: "15px",
      backgroundColor: "#fff",
    },
    imageContainer: {
      width: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    sectionImage: {
      borderRadius: "20px",
      maxHeight: "520px",
      maxWidth: "100%",
      objectFit: "cover",
      boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
      transition: "transform 0.15s ease, box-shadow 0.15s ease", // reduced pop-up animation
    },
    textContainer: {
      width: "50%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "black",
    },
    sectionText: { color: "black", lineHeight: "1.6", marginBottom: "1rem" },
    sectionButton: {
      width: "140px",
      padding: "0.6rem",
      borderRadius: "15px",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition:
        "transform 0.2s ease, background 0.3s ease, box-shadow 0.3s ease",
      alignSelf: "center",
    },
    workoutButton: {
      background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      color: "white",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    },
    mealButton: {
      background: "linear-gradient(135deg, #facc15, #f97316)",
      color: "white",
      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
    },
    footer: {
      backgroundColor: "#000",
      textAlign: "center",
      padding: "1rem",
      margin: 0,
      width: "100%",
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

      <main style={styles.main}>
        {/* Workout Section */}
        <div style={styles.section}>
          <div style={styles.imageContainer}>
            <img
              src={workoutImage}
              alt="Workout"
              style={styles.sectionImage}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 20px 30px rgba(0,0,0,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.25)";
              }}
            />
          </div>
          <div style={styles.textContainer}>
            <h2 style={styles.sectionTitle}>Workout Tracking</h2>
            <p style={styles.sectionText}>
              Track your exercises, monitor progress, log reps and sets, set
              fitness goals, and get insights for improvement. Stay consistent
              with daily routines and see your growth over time. HealthTrack
              provides charts, reminders, and tips to keep you motivated.
            </p>
            <button
              onClick={() => navigate("/workout")}
              style={{ ...styles.sectionButton, ...styles.workoutButton }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              View Workouts
            </button>
          </div>
        </div>

        {/* Meal Section */}
        <div style={styles.section}>
          <div style={styles.textContainer}>
            <h2 style={styles.sectionTitle}>Meal Tracking</h2>
            <p style={styles.sectionText}>
              Log meals, track calories and macros, plan diets, and discover
              healthier eating habits. Set nutrition goals, get suggestions for
              balanced meals, and analyze your progress. HealthTrack helps
              maintain consistency and supports a healthier lifestyle.
            </p>
            <button
              onClick={() => navigate("/meal")}
              style={{ ...styles.sectionButton, ...styles.mealButton }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              View Meals
            </button>
          </div>
          <div style={styles.imageContainer}>
            <img
              src={mealImage}
              alt="Meal"
              style={styles.sectionImage}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 20px 30px rgba(0,0,0,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.25)";
              }}
            />
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
