import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [workoutImage, setWorkoutImage] = useState("");
  const [mealImage, setMealImage] = useState("");
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

    const workoutImages = [
      "/img/workout.png",
      "/img/workout1.png",
      "/img/workout2.png",
      "/img/workout3.png",
      "/img/workout4.png",
      "/img/workout5.png",
      "/img/workout6.png",
      "/img/workout7.png",
      "/img/workout8.png",
      "/img/workout9.png",
    ];
    const mealImages = [
      "/img/meal.png",
      "/img/meal1.png",
      "/img/meal3.png",
      "/img/meal4.png",
      "/img/meal5.png",
    ];
    setWorkoutImage(
      workoutImages[Math.floor(Math.random() * workoutImages.length)]
    );
    setMealImage(mealImages[Math.floor(Math.random() * mealImages.length)]);
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
      console.error(err);
    }
  };

  if (!user)
   
      return (
        <div className="workout-page">
          <Navbar />
          <div className="workout-container">
            <div className="workout-left">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
            <div className="workout-right">
              <div className="skeleton-calendar"></div>
              <div className="skeleton-info"></div>
            </div>
          </div>
          <Footer />
        </div>
      );
    

  return (
    <div
      style={{
        backgroundColor: "#e0e7ef",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar user={user} onEditProfile={() => setEditing(true)} />

      <main
        style={{
          flex: 1,
          padding: "2rem 3rem",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
        }}
      >
        {/* Workout Section */}
        <div style={styles.section}>
          <div style={styles.imageContainer}>
            <img src={workoutImage} alt="Workout" style={styles.sectionImage} />
          </div>
          <div style={styles.textContainer}>
            <h2 style={styles.sectionTitle}>Workout Tracking</h2>
            <p style={styles.sectionText}>
              <strong>HealthTrack</strong> makes daily fitness tracking simple
              and motivating. Log your exercises, reps, and sets with ease, set
              personalized goals, and monitor your progress over time. Organized
              lists keep your workouts structured, while insightful feedback
              helps you improve every day. Stay on track, achieve your goals,
              and make every workout count with HealthTrack.
              <br/>
              <br/>
            </p>
            <button
              onClick={() => navigate("/workout")}
              style={{ ...styles.sectionButton, ...styles.workoutButton }}
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
              <strong>HealthTrack</strong> lets you effortlessly log your daily
              meals and monitor your nutrition. Track calories, protein, carbs,
              and fat for every meal, set dietary goals, and see your progress
              at a glance. Organized lists and daily logs help you stay
              consistent, make healthier choices, and understand your eating
              habits better. With HealthTrack, maintaining a balanced diet
              becomes structured, insightful, and motivating
              <br/>
              <br/>
            </p>
            <button
              onClick={() => navigate("/meal")}
              style={{ ...styles.sectionButton, ...styles.mealButton }}
            >
              View Meals
            </button>
          </div>
          <div style={styles.imageContainer}>
            <img src={mealImage} alt="Meal" style={styles.sectionImage} />
          </div>
        </div>
      </main>

      <Footer goal={user.goal} />

      {/* Edit Profile Modal */}
      {editing && (
        <div style={styles.modal}>
          <form style={styles.form} onSubmit={handleSubmit}>
            <label>PFP</label>
            <input type="file" name="pfp" onChange={handleChange} />

            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
            />

            <label>Age</label>
            <input
              type="number"
              name="age"
              value={form.age || ""}
              onChange={handleChange}
            />

            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight || ""}
              onChange={handleChange}
            />

            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={form.height || ""}
              onChange={handleChange}
            />

            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <button type="submit" style={styles.saveButton}>
                Save
              </button>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "80%",
    margin: "0 auto",
    gap: "2rem",
    padding: "2rem",
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
  },
  workoutButton: {
    background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
    color: "#fff",
  },
  mealButton: {
    background: "linear-gradient(135deg, #facc15, #f97316)",
    color: "#fff",
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
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 50,
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    backgroundColor: "#f3f4f6",
    color: "#000",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "0.5rem 0",
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#d1d5db",
    color: "#000",
    padding: "0.5rem 0",
    borderRadius: "0.25rem",
    border: "none",
    cursor: "pointer",
  },
};
