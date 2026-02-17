import React, { useState } from "react";
import axios from "axios";

// ---------------- Simple Toast Hook ----------------
function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000); // auto remove after 3 sec
  };

  return { toasts, toast };
}

// ---------------- Toaster Component ----------------
function Toaster({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map(({ id, title, description }) => (
        <div
          key={id}
          className="bg-gray-800 text-white p-4 rounded shadow-lg flex justify-between items-start space-x-4"
        >
          <div>
            {title && <div className="font-bold">{title}</div>}
            {description && <div>{description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------- Main App Component ----------------
export default function App() {
  const { toasts, toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
      toast({
        title: "Success",
        description: res.data.title,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch data!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Axios + Toast Example</h1>

      <button
        onClick={fetchData}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Data"}
      </button>

      {/* Toaster */}
      <Toaster toasts={toasts} />
    </div>
  );
}
