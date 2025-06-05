import "./App.css";
import { signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "./utils/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
        },
        { merge: true }
      );

      alert(`Welcome, ${user.displayName}!`);
      navigate("/dashboard");
    } catch (err) {
      alert("Authentication error: " + err.message);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="flex ">
          <h1 className="text-2xl font-bold text-purple-700">MoodMate</h1>{" "}
          <img src="./happiness.png" className="h-10 w-10" alt="logo" />
        </div>

        <nav className="hidden md:flex space-x-6 text-lg font-extrabold">
          <a href="#about" className="text-purple-700 hover:text-pink-500">
            About
          </a>
          <a href="#features" className="text-purple-700 hover:text-pink-500">
            Features
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-purple-800 mb-4">
          Track your emotions. Understand your mind.
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
          MoodMate helps you log how you feel, spot emotional patterns, and
          build mindful habits—all in a clean, distraction-free interface.
        </p>
        <button
          className="bg-purple-600 hover:bg-pink-500 text-white font-medium px-8 py-3 rounded-full text-lg shadow-lg transition"
          onClick={handleGoogleLogin}
        >
          Sign up for Free
        </button>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-20 px-6 md:px-16">
        <h3 className="text-3xl font-semibold text-purple-700 mb-6 text-center">
          Why MoodMate?
        </h3>
        <div className="max-w-4xl mx-auto text-gray-700 text-lg space-y-5">
          <p>
            Mental wellness starts with awareness. MoodMate gives you a safe,
            private space to record your daily emotions with ease.
          </p>
          <p>
            Our visualizations help you make sense of your ups and downs—whether
            it’s stress, joy, fatigue, or excitement.
          </p>
          <p>
            Whether you're starting therapy, journaling, or simply curious about
            your emotional cycles, MoodMate is your trusted companion.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-pink-100 px-6 md:px-16">
        <h3 className="text-3xl font-semibold text-purple-700 text-center mb-12">
          Core Features
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto text-gray-700">
          {[
            {
              title: "Mood Tracker",
              desc: "Log how you feel each day using emojis and notes.",
              link: "./analysis.png",
            },
            {
              title: "Emotional Trends",
              desc: "Visualize how your mood changes over weeks and months.",
              link: "./feeling.png",
            },
            {
              title: "Journal Entries",
              desc: "Attach notes to your daily moods for deeper reflection.",
              link: "./notebook.png",
            },
            {
              title: "Smart Reminders",
              desc: "Receive reminders at your preferred check-in times.",
              link: "./remainder.png",
            },
            {
              title: "AI Mood Insights",
              desc: "Get summaries and feedback on your emotional state.",
              link: "./ai.png",
            },
            {
              title: "Private & Secure",
              desc: "Your entries are encrypted and stored safely in Firebase.",
              link: "./privacy.png",
            },
          ].map((feature, index) => (
            <a href="#" key={index}>
              <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition justify-items-center ">
                <h4 className="text-xl font-semibold text-primary mb-2 text-center ">
                  {feature.title}
                </h4>
                <div className="w-10 h-10 ">
                  <img src={feature.link} alt="image" />
                </div>
                <p className="py-5">{feature.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-8">
        © {new Date().getFullYear()} MoodMate. Built with 💜 using React &
        Firebase.
      </footer>
    </div>
  );
}

export default App;
