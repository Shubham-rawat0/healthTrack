import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import CheckAuth from "../components/CheckAuth";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Register from "../pages/Register";
import Workout from "../pages/Workout";
import Meal from "../pages/Meal";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth isProtected={true}>
              <Profile />
            </CheckAuth>
          }
        />
        <Route
          path="/login"
          element={
            <CheckAuth isProtected={false}>
              <Login />
            </CheckAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <CheckAuth isProtected={false}>
              <Signup/>
            </CheckAuth>
          }
        />
        <Route
          path="/register"
          element={
            <CheckAuth isProtected={false}>
              <Register />
            </CheckAuth>
          }
        />
        <Route
          path="/workout"
          element={
            <CheckAuth isProtected={true}>
              <Workout />
            </CheckAuth>
          }
        />
        <Route
          path="/meal"
          element={
            <CheckAuth isProtected={true}>
              <Meal/>
            </CheckAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
