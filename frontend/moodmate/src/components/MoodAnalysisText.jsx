// components/MoodAnalysisText.jsx
import React from "react";

const MoodAnalysisText = ({ analysis }) => {
  return (
    <div>
      <h4 className="text-lg font-bold mt-4 mb-2">🧠 AI Mood Summary</h4>
      <p className="whitespace-pre-line">{analysis}</p>
    </div>
  );
};

export default MoodAnalysisText;
