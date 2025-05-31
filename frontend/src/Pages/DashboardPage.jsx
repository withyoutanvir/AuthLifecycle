import { motion as Motion } from "framer-motion";
import { useAuthStore } from "../Store/authStore";
import { formatDate } from "../utils/date";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [aitopiaData, setAitopiaData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
  };
  
  useEffect(() => {
    const fetchAitopiaLang = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/aitopia/lang`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "Hello from dashboard!" }), // example payload
        });
        const data = await response.json();
        setAitopiaData(data);
      } catch (error) {
        console.error("Failed to fetch Aitopia language data", error);
        setAitopiaData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAitopiaLang();
  }, []);

  return (
    <Motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800'
    >
      <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text'>
        Dashboard
      </h2>

      <div className='space-y-6'>
        <Motion.div
          className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className='text-xl font-semibold text-green-400 mb-3'>Profile Information</h3>
          <p className='text-gray-300'>Name: {user.name}</p>
          <p className='text-gray-300'>Email: {user.email}</p>
        </Motion.div>

        <Motion.div
          className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className='text-xl font-semibold text-green-400 mb-3'>Account Activity</h3>
          <p className='text-gray-300'>
            <span className='font-bold'>Joined: </span>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className='text-gray-300'>
            <span className='font-bold'>Last Login: </span>
            {formatDate(user.lastLogin)}
          </p>
        </Motion.div>

        <Motion.div
          className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className='text-xl font-semibold text-green-400 mb-3'>Aitopia Language Data</h3>
          {loading ? (
            <p className='text-gray-300'>Loading...</p>
          ) : (
            <pre className='text-gray-300 text-sm overflow-x-auto'>
              {aitopiaData ? JSON.stringify(aitopiaData, null, 2) : "No data available"}
            </pre>
          )}
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className='mt-4'
      >
        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
        >
          Logout
        </Motion.button>
      </Motion.div>
    </Motion.div>
  );
};

export default DashboardPage;
