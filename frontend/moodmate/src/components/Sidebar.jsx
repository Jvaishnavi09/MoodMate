import { Calendar, BarChart2, BrainCog, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-purple-700 text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold tracking-wide">
        <a href="/dashboard">MoodMate</a>
      </div>
      <nav className="flex-1 space-y-4 px-4 mt-4">
        <Link
          to="/dashboard/calendar-mood"
          className="flex items-center space-x-3 hover:bg-purple-600 px-4 py-2 rounded-lg transition"
        >
          <Calendar size={20} /> <span>Calendar</span>
        </Link>
        <Link
          to="/dashboard/moodchart"
          className="flex items-center space-x-3 hover:bg-purple-600 px-4 py-2 rounded-lg transition"
        >
          <BarChart2 size={20} /> <span>Mood Chart</span>
        </Link>
        <Link
          to="/dashboard/ai-insights"
          className="flex items-center space-x-3 hover:bg-purple-600 px-4 py-2 rounded-lg transition"
        >
          <BrainCog size={20} /> <span>AI Insights</span>
        </Link>
        <Link
          to="/dashboard/export-report"
          className="flex items-center space-x-3 hover:bg-purple-600 px-4 py-2 rounded-lg transition"
        >
          <BrainCog size={20} /> <span>Export Report</span>
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 bg-pink-500 hover:bg-pink-600 px-4 py-3 m-4 rounded-lg"
      >
        <LogOut size={20} /> <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
