import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import { setDoc, doc } from "firebase/firestore";
import { fetchMoods } from "../utils/fetchMoods"; // Should return { [date]: { emoji, note } }

const MoodAnalysis = () => {
  const [user] = useAuthState(auth);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const generateMoodSummary = async () => {
      if (!user) return;
      setLoading(true);
      setErrorMsg("");

      try {
        const moods = await fetchMoods(user.uid);

        if (!moods || Object.keys(moods).length === 0) {
          setSummary("No mood data available to analyze.");
          return;
        }

        const moodEntries = Object.values(moods).filter(
          (entry) => entry.emoji && entry.note
        ); // Only valid ones

        if (moodEntries.length === 0) {
          setSummary("No valid mood entries (emoji + note) to analyze.");
          return;
        }

        const response = await fetch(
          `${import.meta.env.BASE_URL}/api/analyze-moods`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ moods: moodEntries }),
          }
        );

        const data = await response.json();

        if (response.ok && data.summary) {
          setSummary(data.summary);

          await setDoc(
            doc(db, "mood_summaries", user.uid),
            {
              summary: data.summary,
              generatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } else {
          throw new Error(
            data.error || "Backend did not return a valid summary."
          );
        }
      } catch (err) {
        console.error("Mood analysis error:", err);
        setErrorMsg("Could not generate summary at this time.");
      } finally {
        setLoading(false);
      }
    };

    generateMoodSummary();
  }, [user]);

  return (
    <div className="p-6 rounded-lg shadow bg-white mt-6 dark:bg-gray-900">
      <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
        Your Weekly Mood Summary
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Analyzing moods...</p>
      ) : errorMsg ? (
        <p className="text-red-600">{errorMsg}</p>
      ) : (
        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
          {summary}
        </p>
      )}
    </div>
  );
};

export default MoodAnalysis;
