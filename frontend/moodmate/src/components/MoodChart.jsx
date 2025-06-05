import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import emojis from "../utils/emojis"; // Assuming this is correctly imported and structured

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Helper function to get a score for an emoji
const getScoreForEmoji = (emoji) => {
  const entry = emojis.find((e) => e.emoji === emoji);
  // Default to 3 (neutral) if emoji not found or score not present
  return entry?.score ?? 3;
};

// Helper function to get a human-readable label for a score
const getLabelForScore = (score) => {
  if (score >= 4.5) return "Excellent Mood 😊";
  if (score >= 3.5) return "Good Mood 🙂";
  if (score >= 2.5) return "Neutral 😐";
  if (score >= 2) return "Feeling Down 😔";
  return "Needs a Hug 💜"; // For scores below 2
};

const MoodChart = () => {
  const [chartData, setChartData] = useState(null);
  const [avgScore, setAvgScore] = useState(null);
  const [avgScoreLabel, setAvgScoreLabel] = useState(""); // State for the label

  useEffect(() => {
    // Listen for auth state changes to fetch user data
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        const moods = snap.data()?.moods || {};
        prepareChartData(moods);
      } else {
        // Handle no user logged in scenario
        setChartData(null);
        setAvgScore(null);
        setAvgScoreLabel("Login to see your mood trend.");
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []); // Run once on component mount

  const prepareChartData = (moodData) => {
    const labels = [];
    const data = [];

    // Sort dates to ensure chronological order and get only last 7
    const sortedDates = Object.keys(moodData).sort().slice(-7);

    sortedDates.forEach((dateStr) => {
      // Access the emoji property from the nested object
      const moodEntry = moodData[dateStr];
      const emoji = moodEntry?.emoji; // Use optional chaining in case moodEntry is null/undefined

      const score = getScoreForEmoji(emoji);
      labels.push(dateStr.slice(5)); // Show only MM-DD (e.g., '06-03')
      data.push(score);
    });

    const totalScore = data.reduce((sum, val) => sum + val, 0);
    const average =
      data.length > 0 ? (totalScore / data.length).toFixed(2) : null;

    setAvgScore(average);
    // Set the label for the average score
    setAvgScoreLabel(
      average !== null
        ? getLabelForScore(parseFloat(average))
        : "No mood data to analyze."
    );

    setChartData({
      labels,
      datasets: [
        {
          label: "Overall Mood Score",
          data,
          fill: false,
          borderColor: "#f472b6", // Tailwind pink-400 equivalent for consistency
          backgroundColor: "#f472b6",
          pointBackgroundColor: "#9333ea", // Tailwind purple-600 equivalent
          pointBorderColor: "#f472b6",
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
          tension: 0.4, // Makes the line slightly curved
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container's dimensions
    scales: {
      y: {
        min: 1, // Minimum score
        max: 5, // Maximum score
        ticks: {
          stepSize: 1,
          color: "#a78bfa", // Tailwind purple-400 for consistency
          callback: (value) => getLabelForScore(value), // Custom labels on y-axis
          font: { size: 14 },
        },
        grid: {
          color: "#e5e7eb", // Tailwind gray-200 for consistency
        },
      },
      x: {
        ticks: {
          color: "#a78bfa", // Tailwind purple-400 for consistency
          font: { size: 14 },
        },
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            `${getLabelForScore(context.parsed.y)} (Score: ${
              context.parsed.y
            })`, // Corrected template literal syntax
        },
      },
      legend: {
        labels: {
          color: "#a78bfa", // Tailwind purple-400 for consistency
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6 w-full h-full">
      <h3 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
        📈 Weekly Mood Trend
      </h3>

      {/* Average Score Display */}
      {avgScore !== null && ( // Only show if avgScore is calculated
        <div className="mb-2 text-purple-600 dark:text-purple-300 text-lg m-2 font-medium">
          Your average mood this week:{" "}
          <span className="font-bold text-pink-500">{avgScore} / 5</span>
          <span className="ml-2 text-purple-700 dark:text-purple-400">
            ({avgScoreLabel})
          </span>
        </div>
      )}
      {/* If no data, show message instead of average */}
      {avgScore === null && avgScoreLabel && (
        <div className="mb-2 text-purple-600 dark:text-purple-300 text-lg m-2 font-medium">
          {avgScoreLabel}
        </div>
      )}

      {/* Chart Container - Adjusted for size */}
      <div className="flex flex-col justify-center items-center w-full h-96">
        {" "}
        {/* Outer flex container with fixed height */}
        {chartData ? (
          <div className="w-full h-full">
            {" "}
            {/* Inner div to ensure Line fills it */}
            <Line
              key={chartData.labels.join(",")} // Key to force re-render if data changes
              data={chartData}
              options={chartOptions}
              // The className here applies to the <canvas> element Chart.js renders
              className="max-w-full max-h-full" // Ensure canvas doesn't overflow its parent
            />
          </div>
        ) : (
          <p className="text-gray-500">Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default MoodChart;
