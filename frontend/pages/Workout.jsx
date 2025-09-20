import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Workout.css";

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
  const [logInput, setLogInput] = useState("");

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
    const payload = { completedSets: parseInt(logInput || 0) };
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
      setShowLogPanel(false);
      setLogInput("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="workout-container">
      <Navbar />

      <div className="workout-main">
        {/* Left Panel */}
        <div className="left-panel">
          <button
            className="btn-add-top"
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
              <div className="exercise-card-top">
                <h3 className="exercise-name">{ex.name}</h3>
                <div className="exercise-buttons">
                  <button
                    className="btn-small btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(ex);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-small btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(ex._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="exercise-info">Type: {ex.type}</p>
              <p className="exercise-info">Target Sets: {ex.targetSets}</p>
              <p className="exercise-info">Duration: {ex.duration} mins</p>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {selectedExercise ? (
            <>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    const today = new Date();
                    const isToday =
                      date.toDateString() === today.toDateString();
                    const log = getLogForDate(selectedExercise, date);
                    if (isToday) return "tile-today";
                    if (log.completedSets >= selectedExercise.targetSets)
                      return "tile-completed";
                    if (log.completedSets > 0) return "tile-partial";
                    return "tile-empty";
                  }
                }}
                tileContent={({ date, view }) => {
                  if (view === "month") {
                    const log = getLogForDate(selectedExercise, date);
                    return log.completedSets > 0 ? (
                      <div className="tile-text">
                        {log.completedSets}/{selectedExercise.targetSets}
                      </div>
                    ) : null;
                  }
                }}
              />

              <div className="selected-date-text">
                Selected Date: {selectedDate.toDateString()}
              </div>

              <div className="info-panel">
                <p>Target Sets: {selectedExercise.targetSets}</p>

                <button
                  className="btn-update-log"
                  onClick={() => {
                    setShowLogPanel(!showLogPanel);
                    setLogInput(
                      getLogForDate(selectedExercise, selectedDate)
                        .completedSets
                    );
                  }}
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
                      className="log-input"
                    />
                    / {selectedExercise.targetSets}
                    <button className="btn-save-log" onClick={handleLogSubmit}>
                      Save
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="select-exercise-text">
              Select an exercise to see logs
            </p>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {editingExercise && (
        <div className="modal">
          <form className="modal-form" onSubmit={handleExerciseSubmit}>
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
            ></textarea>
            <input
              type="number"
              name="targetSets"
              placeholder="Target Sets"
              value={form.targetSets || ""}
              onChange={handleChange}
              required
            />
            <div className="modal-buttons">
              <button type="submit" className="btn-submit">
                {" "}
                {form._id ? "Update" : "Add"}{" "}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setEditingExercise(false);
                  setForm({});
                }}
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
