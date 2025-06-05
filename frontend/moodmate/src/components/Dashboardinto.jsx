import React from "react";
import { SparklesIcon } from "lucide-react"; // Optional, needs lucide-react
import { Link } from "react-router-dom";

const DashboardIntro = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <SparklesIcon className="w-12 h-12 text-purple-400 mb-4 animate-pulse" />
      <h2 className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">
        Welcome to MoodMate 💜
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-md">
        Track your daily mood, visualize your emotional patterns, and gain
        AI-powered insights to feel more in control of your mental wellness.
      </p>
      <div className="mt-6 space-x-4">
        <Link
          to="moodchart"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition"
        >
          View Mood Trends
        </Link>
        <Link
          to="ai-insights"
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-xl transition"
        >
          Get AI Insights
        </Link>
      </div>
    </div>
  );
};

export default DashboardIntro;
