import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { auth } from "../utils/firebase";

const Header = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow">
      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300">
        Welcome back, {user?.displayName?.split(" ")[0] || "Friend"} 👋
      </h2>

      <div className="flex items-center space-x-4">
        {/* User avatar */}
        {user && (
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="h-10 w-10 rounded-full border-2 border-pink-500"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
