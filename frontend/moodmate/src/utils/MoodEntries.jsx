import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

const MoodEntries = () => {
  const [moodData, setMoodData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data().moods || {};
          setMoodData(data);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const sortedEntries = Object.entries(moodData).sort(
    ([dateA], [dateB]) => new Date(dateB) - new Date(dateA) // newest first
  );

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mt-5">
      <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-300">
        Mood History
      </h2>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading moods...</p>
      ) : sortedEntries.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No mood entries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Mood</th>
                <th className="px-4 py-2 border">Note</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map(([date, entry]) => (
                <tr
                  key={date}
                  className="text-center border-t dark:border-gray-600"
                >
                  <td className="px-4 py-2 border">{date}</td>
                  <td className="px-4 py-2 border text-xl">{entry.emoji}</td>
                  <td className="px-4 py-2 border text-left">{entry.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MoodEntries;
