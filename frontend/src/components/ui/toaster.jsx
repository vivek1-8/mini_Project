import React from "react";
import axios from "axios";

// ---------------------- SIMPLE TOAST HOOK ----------------------
function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const toast = ({ title, description }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description };
    setToasts((prev) => [...prev, newToast]);

    // auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);

    return id;
  };

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, toast, dismiss };
}

// ---------------------- TOASTER COMPONENT ----------------------
function Toaster({ toasts, dismiss }) {
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
          <button
            onClick={() => dismiss(id)}
            className="text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------------------- MAIN APP WITH AXIOS FETCH ----------------------
export default function App() {
  const { toasts, toast, dismiss } = useToast();

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      toast({
        title: "Success",
        description: res.data.title,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch data!",
      });
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={fetchData}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Fetch Data
      </button>

      {/* TOASTER */}
      <Toaster toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
