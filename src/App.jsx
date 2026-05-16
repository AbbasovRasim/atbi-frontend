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
        <Toaster />

        <Routes>
          <Route path="/login" element={<Login />} />

          {/* ✅ MÜVƏQQƏTİ DƏYİŞİKLİK - HƏR KƏSƏ AÇIQ */}
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
