import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./Pages/Dashboard";
import MoodChart from "./components/MoodChart";
import MoodAnalysis from "./components/MoodAnalysis";
import ExportReport from "./components/ExportReport";
import CalendarMood from "./components/CalendarMood";
import DashboardIntro from "./components/Dashboardinto";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        {/* Nested routing under /dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardIntro />} /> {/* default child */}
          <Route path="calendar-mood" element={<CalendarMood />} />
          <Route path="moodchart" element={<MoodChart />} />
          <Route path="ai-insights" element={<MoodAnalysis />} />
          <Route path="export-report" element={<ExportReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
