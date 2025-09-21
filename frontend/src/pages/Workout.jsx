import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../workout.css";

export default function Workout() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [form, setForm] = useState({});
  const [showLogPanel, setShowLogPanel] = useState(false);
  const [logInput, setLogInput] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(resUser.data);

        const resExercises = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/workout`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExercises(resExercises.data.exercises || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExerciseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        const res = await axios.patch(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/workout/${form._id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExercises((prev) =>
          prev.map((ex) =>
            ex._id === res.data.exercise._id ? res.data.exercise : ex
          )
        );
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/workout`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExercises(res.data.workout.exercises);
      }
      setForm({});
      setEditingExercise(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (ex) => {
    setForm(ex);
    setEditingExercise(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/workout/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExercises((prev) => prev.filter((ex) => ex._id !== id));
      if (selectedExercise?._id === id) setSelectedExercise(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getLogForDate = (exercise, date) => {
    if (!exercise?.logs) return { completedSets: 0 };
    const log = exercise.logs.find(
      (l) => new Date(l.date).toDateString() === new Date(date).toDateString()
    );
    return log || { completedSets: 0 };
  };

  const handleLogSubmit = async () => {
    if (!selectedExercise) return;
    const payload = {
      completedSets: parseInt(logInput || 0),
      date: selectedDate,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/workout/log/${
          selectedExercise._id
        }`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExercises((prev) =>
        prev.map((ex) =>
          ex._id === res.data.exercise._id ? res.data.exercise : ex
        )
      );
      setSelectedExercise(res.data.exercise);

      setShowLogPanel(false);
      setLogInput(0);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
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
  }

  return (
    <div className="workout-page">
      <Navbar />
      <div className="workout-container">
        {/* Left Panel */}
        <div className="workout-left">
          <button
            className="add-exercise-btn"
            onClick={() => {
              setEditingExercise(true);
              setForm({});
            }}
          >
            Add Exercise
          </button>

          {exercises.map((ex) => (
            <div
              key={ex._id}
              className={`exercise-card ${
                selectedExercise?._id === ex._id ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedExercise(ex);
                setSelectedDate(new Date());
                setShowLogPanel(false);
              }}
            >
              <h3>{ex.name}</h3>
              <p>Type: {ex.type}</p>
              <p>Target Sets: {ex.targetSets}</p>
              <p>Duration: {ex.duration} mins</p>
              {ex.description && <p>{ex.description}</p>}
              <div className="exercise-btn-group">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(ex);
                  }}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ex._id);
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="workout-right">
          {selectedExercise ? (
            <>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    const log = getLogForDate(selectedExercise, date);
                    const today = new Date();
                    if (date.toDateString() === today.toDateString())
                      return "today-tile";
                    if (log.completedSets >= selectedExercise.targetSets)
                      return "completed-tile";
                    if (log.completedSets > 0) return "partial-tile";
                    return "not-started-tile";
                  }
                }}
              />

              {/* Info Panel */}
              <div className="info-panel">
                <h3>
                  {selectedExercise.name} - {selectedDate.toDateString()}
                </h3>
                <p>Duration: {selectedExercise.duration} mins</p>
                <p>Target Sets: {selectedExercise.targetSets}</p>
                <p>
                  Sets Completed:{" "}
                  {getLogForDate(selectedExercise, selectedDate).completedSets}
                </p>

                {/* Status with color */}
                <p>
                  Status:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        getLogForDate(selectedExercise, selectedDate)
                          .completedSets >= selectedExercise.targetSets
                          ? "green"
                          : getLogForDate(selectedExercise, selectedDate)
                              .completedSets > 0
                          ? "orange"
                          : "red",
                    }}
                  >
                    {getLogForDate(selectedExercise, selectedDate)
                      .completedSets >= selectedExercise.targetSets
                      ? "Completed"
                      : getLogForDate(selectedExercise, selectedDate)
                          .completedSets > 0
                      ? "In Progress"
                      : "Not Started"}
                  </span>
                </p>

                <button
                  onClick={() => {
                    setShowLogPanel(!showLogPanel);
                    setLogInput(
                      getLogForDate(selectedExercise, selectedDate)
                        .completedSets
                    );
                  }}
                  className="update-log-btn"
                >
                  {showLogPanel ? "Cancel" : "Update Log"}
                </button>

                {showLogPanel && (
                  <div className="log-input-group">
                    <input
                      type="number"
                      min="0"
                      max={selectedExercise.targetSets}
                      value={logInput}
                      onChange={(e) => setLogInput(e.target.value)}
                    />
                    / {selectedExercise.targetSets}
                    <button className="save-log-btn" onClick={handleLogSubmit}>
                      Save
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>Select an exercise to see logs</p>
          )}
        </div>
      </div>

      {/* Add/Edit Exercise Modal */}
      {editingExercise && (
        <div className="exercise-modal">
          <form onSubmit={handleExerciseSubmit} className="exercise-form">
            <input
              type="text"
              name="name"
              placeholder="Exercise Name"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="type"
              placeholder="Type"
              value={form.type || ""}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (min)"
              value={form.duration || ""}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="targetSets"
              placeholder="Target Sets"
              value={form.targetSets || ""}
              onChange={handleChange}
              required
            />
            <div className="form-btn-group">
              <button type="submit" className="modal-add-btn">
                {form._id ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingExercise(false);
                  setForm({});
                }}
                className="modal-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
