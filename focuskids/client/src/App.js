import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProfileSelect from "./pages/ProfileSelect";
import Dashboard from "./pages/Dashboard";
import RewardScreen from "./pages/RewardScreen";
import ParentPanel from "./pages/ParentPanel";
import ProfilePage from "./pages/ProfilePage";
import "./index.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-bg-light max-w-md mx-auto relative shadow-2xl overflow-hidden">
          <Routes>
            <Route path="/" element={<ProfileSelect />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reward" element={<RewardScreen />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/parent" element={<ParentPanel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
