import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
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
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
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

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-xl font-bold">HealthTrack</h1>
        <span className="font-medium">{user.name}</span>
        <button
          onClick={() => setEditing(true)}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
        >
          Profile
        </button>
      </nav>

      {/* Edit Profile Form */}
      {editing && (
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-4 border p-6 rounded shadow-md bg-white"
          >
            <input
              type="file"
              name="pfp"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="age"
              value={form.age || ""}
              onChange={handleChange}
              placeholder="Age"
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="weight"
              value={form.weight || ""}
              onChange={handleChange}
              placeholder="Weight (kg)"
              className="w-full border p-2 rounded"
            />
            <input
              type="number"
              name="height"
              value={form.height || ""}
              onChange={handleChange}
              placeholder="Height (cm)"
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="w-1/2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-auto border-t">
        <p className="text-gray-700">
          <span className="font-medium">Goal:</span> {user.goal}
        </p>
      </footer>
    </div>
  );
}
