import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { auth, db } from "../utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import moods from "../utils/emojis";

const CalendarMood = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [emojiMap, setEmojiMap] = useState({});
  const [userId, setUserId] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const chunkArray = (array, size) =>
    array.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]),
      []
    );
  const rows = chunkArray(moods, 8);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchMoods(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMoods = async (uid) => {
    const ref = doc(db, "users", uid);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const data = docSnap.data().moods || {};
      setEmojiMap(data);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateKey = date.toISOString().split("T")[0];
    const entry = emojiMap[dateKey];
    setNote(entry?.note || "");
    setError("");
    setShowPicker(true);
  };

  const handleMoodSelect = async (emoji) => {
    const trimmedNote = note.trim();
    if (!trimmedNote) {
      setError("Please enter a description before selecting an emoji.");
      return;
    }

    const dateKey = selectedDate.toISOString().split("T")[0];
    const newEntry = {
      emoji: emoji.emoji,
      note: trimmedNote,
    };

    const updated = {
      ...emojiMap,
      [dateKey]: newEntry,
    };

    setEmojiMap(updated);
    setNote("");
    setError("");
    setShowPicker(false);

    if (userId) {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { moods: updated }, { merge: true });
    }
  };

  const handleClose = () => {
    setNote("");
    setError("");
    setShowPicker(false);
  };

  const tileContent = ({ date }) => {
    const dateKey = date.toISOString().split("T")[0];
    const entry = emojiMap[dateKey];
    if (entry?.emoji) {
      return <div className="text-xl text-center pt-1">{entry.emoji}</div>;
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h3 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 m-1 p-3">
        How are you feeling?
      </h3>
      <div className="flex justify-between p-3">
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate}
          tileContent={tileContent}
          className="react-calendar rounded-lg shadow-sm text-black"
        />
        <div>
          {showPicker && (
            <div className="border rounded-lg w-[350px] p-2 bg-white dark:bg-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                  How did you feel on {selectedDate.toLocaleDateString("en-GB")}
                  ?
                </h3>
                <img
                  src="/close.png"
                  className="w-7 h-7 cursor-pointer ml-3"
                  alt="close"
                  onClick={handleClose}
                />
              </div>

              <textarea
                placeholder="Say me how you feel .."
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setError("");
                }}
                className="w-full p-2 m-1 border rounded text-white"
              />
              {error && (
                <p className="text-red-600 text-sm mt-1 ml-1">{error}</p>
              )}

              <div
                className={`bg-pink-100 p-1 m-1 rounded-lg ${
                  !note.trim() ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex mb-1">
                    {row.map((emoji, i) => (
                      <div
                        key={i}
                        onClick={() => handleMoodSelect(emoji)}
                        title={`Emotion: ${emoji.id}`}
                        className="p-1 text-xl bg-white rounded-md cursor-pointer mx-0.5 w-8 text-center hover:scale-110 transition-transform"
                      >
                        {emoji.emoji}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarMood;
