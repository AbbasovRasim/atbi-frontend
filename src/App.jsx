import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IncidentList from "./pages/IncidentList";
import CreateIncident from "./pages/CreateIncident";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,

            style: {
              background: "#1f1f1f",
              color: "#fff",
              borderRadius: "14px",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "500",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            },

            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Navbar />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/incidents" element={<IncidentList />} />
              <Route path="/create-incident" element={<CreateIncident />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
