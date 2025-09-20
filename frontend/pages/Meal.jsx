import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./meal.css";

export default function Meal() {
  const token = localStorage.getItem("token");

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLogPanel, setShowLogPanel] = useState(false);
  const [logConsumed, setLogConsumed] = useState(false);
  const [editingMeal, setEditingMeal] = useState(false);
  const [form, setForm] = useState({});

  // Fetch meals
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/meal`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMeals(res.data.meals || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [token]);

  // Set default logConsumed when meal selected
  useEffect(() => {
    if (selectedMeal) {
      const log = selectedMeal.logs.find(
        (l) => new Date(l.date).toDateString() === selectedDate.toDateString()
      );
      setLogConsumed(log?.consumed || false);
    }
  }, [selectedMeal, selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        const res = await axios.patch(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/meal/${form._id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMeals((prev) =>
          prev.map((m) => (m._id === res.data.meal._id ? res.data.meal : m))
        );
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_API}/api/auth/meal`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMeals([res.data.meal, ...meals]);
      }
      setForm({});
      setEditingMeal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (meal) => {
    setForm(meal);
    setEditingMeal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/meal/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMeals((prev) => prev.filter((m) => m._id !== id));
      if (selectedMeal?._id === id) setSelectedMeal(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogSubmit = async () => {
    if (!selectedMeal) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/meal/log/${
          selectedMeal._id
        }`,
        { consumed: logConsumed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMeals((prev) =>
        prev.map((m) => (m._id === res.data.meal._id ? res.data.meal : m))
      );
      setShowLogPanel(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getLogForDate = (meal, date) => {
    if (!meal?.logs) return { consumed: false };
    const log = meal.logs.find(
      (l) => new Date(l.date).toDateString() === new Date(date).toDateString()
    );
    return log || { consumed: false };
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
    <div className="meal-container">
      <Navbar />

      <div className="meal-body">
        {/* Left panel */}
        <div className="meal-left">
          <button
            className="btn-add-meal"
            onClick={() => {
              setEditingMeal(true);
              setForm({});
            }}
          >
            Add Meal
          </button>

          {meals.map((meal) => (
            <div
              key={meal._id}
              className={`meal-card ${
                selectedMeal?._id === meal._id ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedMeal(meal);
                setSelectedDate(new Date());
                setShowLogPanel(false);
              }}
            >
              <div className="meal-card-top">
                <span className="meal-name">{meal.food}</span>
                <div className="meal-buttons">
                  <button
                    className="btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(meal);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(meal._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="meal-info">
                {meal.description && <p>{meal.description}</p>}
                <p>Calories: {meal.calories || 0}</p>
                <p>
                  Protein: {meal.protein}g </p>
                  <p>Carbs: {meal.carbs}g</p>
                  <p>Fat:{" "}
                  {meal.fat}g</p>   
                
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div className="meal-right">
          {selectedMeal ? (
            <>
              <Calendar
                value={selectedDate}
                onChange={setSelectedDate}
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    const log = getLogForDate(selectedMeal, date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const d = new Date(date);
                    d.setHours(0, 0, 0, 0);
                    if (d.getTime() === today.getTime()) return "tile-today";
                    return log.consumed ? "tile-consumed" : "tile-empty";
                  }
                }}
              />
              <div className="selected-date-text">
                Selected Date: {selectedDate.toDateString()}
              </div>

              <div className="info-panel">
                <h3>{selectedMeal.food}</h3>

                <p>
                  Status:{" "}
                  {getLogForDate(selectedMeal, selectedDate).consumed
                    ? "completed"
                    : "not completed"}
                </p>

                <button
                  className="btn-save-log"
                  onClick={() => setShowLogPanel(!showLogPanel)}
                >
                  {showLogPanel ? "Cancel" : "Update Log"}
                </button>

                {showLogPanel && (
                  <div className="log-input-group">
                    <label>Consumed:</label>
                    <select
                      value={logConsumed ? "yes" : "no"}
                      onChange={(e) => setLogConsumed(e.target.value === "yes")}
                      className="log-input"
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    <button className="btn-save-log" onClick={handleLogSubmit}>
                      Save
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="select-exercise-text">Select a meal to see details</p>
          )}
        </div>
      </div>

      {/* Add/Edit Meal Modal */}
      {editingMeal && (
        <div className="modal">
          <form className="modal-form" onSubmit={handleMealSubmit}>
            <input
              type="text"
              name="food"
              placeholder="Meal Name"
              value={form.food || ""}
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
              name="calories"
              placeholder="Calories"
              value={form.calories || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="protein"
              placeholder="Protein (g)"
              value={form.protein || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="carbs"
              placeholder="Carbs (g)"
              value={form.carbs || ""}
              onChange={handleChange}
            />
            <input
              type="number"
              name="fat"
              placeholder="Fat (g)"
              value={form.fat || ""}
              onChange={handleChange}
            />
            <div className="modal-buttons">
              <button type="submit" className="btn-submit">
                {form._id ? "Update" : "Add"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setEditingMeal(false);
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
