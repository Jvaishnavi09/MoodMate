import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { auth } from "../utils/firebase";
import { fetchMoods } from "../utils/fetchMoods";
import MoodAnalysisText from "../components/MoodAnalysisText";

// ✅ Helper to make emojis safe for PDF rendering
function emojiToUnicode(str) {
  return [...str]
    .map((char) => {
      const code = char.codePointAt(0).toString(16);
      return String.fromCodePoint(parseInt(code, 16));
    })
    .join("");
}

const ExportReport = () => {
  const [moods, setMoods] = useState({});
  const [analysis, setAnalysis] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const data = await fetchMoods(user.uid);
        const sorted = Object.entries(data).sort(
          ([a], [b]) => new Date(b) - new Date(a)
        );
        const latest100 = Object.fromEntries(sorted.slice(0, 100));
        setMoods(latest100);

        const analysisData = await fetch(`/api/analysis/${user.uid}`);
        const result = await analysisData.json();
        setAnalysis(result.analysis || "No AI analysis found.");
      } catch (error) {
        console.error("Error fetching mood or analysis data:", error);
      }
    };

    const unsub = auth.onAuthStateChanged((user) => {
      if (user) fetchData();
      else {
        setMoods({});
        setAnalysis("Please log in to export your report.");
      }
    });

    return () => unsub();
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF();
      const margin = 15;
      let y = 20;

      pdf.setFont("Helvetica", "normal");
      pdf.setFontSize(20);
      pdf.setTextColor("#6D28D9");
      pdf.text("MoodMate Report", margin, y);
      y += 12;

      pdf.setFontSize(14);
      pdf.setTextColor("#111827");
      pdf.text("📅 Mood Entries (latest 100):", margin, y);
      y += 8;

      const moodEntries = Object.entries(moods);
      for (let [date, moodObj] of moodEntries) {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        const emojiText = emojiToUnicode(moodObj.emoji || ""); // fix
        const note = moodObj.note || "";
        const line = `${date}: ${emojiText} - ${note}`;
        pdf.text(line, margin + 5, y);
        y += 8;
      }

      y += 10;
      pdf.setFontSize(14);
      pdf.setTextColor("#6B21A8");
      pdf.text("🧠 AI Mood Summary:", margin, y);
      y += 8;

      pdf.setFontSize(12);
      pdf.setTextColor("#1F2937");
      const lines = pdf.splitTextToSize(analysis, 180);
      if (y + lines.length * 7 > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(lines, margin, y);

      pdf.save("moodmate_report.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-purple-700 dark:text-purple-300">
          Export Mood Report
        </h3>
        <button
          onClick={handleDownload}
          className="bg-purple-600 hover:bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
          disabled={downloading}
        >
          {downloading ? "Generating..." : "Download PDF"}
        </button>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-800 dark:text-gray-200 max-h-[400px] overflow-y-auto">
        <h4 className="text-lg font-bold mb-2">📅 Mood Entries (latest 100)</h4>
        {Object.keys(moods).length > 0 ? (
          <ul className="list-disc ml-5 space-y-1">
            {Object.entries(moods).map(([date, entry]) => (
              <li key={date}>
                <strong>{date}:</strong> {entry.emoji} - {entry.note}
              </li>
            ))}
          </ul>
        ) : (
          <p>No mood entries found.</p>
        )}
        <MoodAnalysisText analysis={analysis} />
      </div>
    </div>
  );
};

export default ExportReport;
